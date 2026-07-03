import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class ContactsService {
  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsappService
  ) {}

  async sendBulkMessage(messageText: string, mediaType?: string, mediaUrl?: string) {
    const contacts = await this.prisma.contact.findMany();
    let sentCount = 0;
    let failedCount = 0;
    const failedContacts = [];
    
    for (const contact of contacts) {
      if (contact.phone) {
        try {
          await this.whatsappService.sendMessage(contact.phone, messageText, mediaType, mediaUrl);
          
          // Log outbound message in database
          await this.prisma.message.create({
            data: {
              contactId: contact.id,
              direction: 'OUTBOUND',
              type: mediaType === 'image' ? 'IMAGE' : 'TEXT',
              content: mediaUrl ? `[Media: ${mediaType}] ${mediaUrl}\n${messageText}` : messageText,
              status: 'SENT',
            }
          });
          
          sentCount++;
        } catch (error) {
          console.error(`Failed to send message to ${contact.phone}`, error);
          
          // Log failed outbound message in database
          try {
            await this.prisma.message.create({
              data: {
                contactId: contact.id,
                direction: 'OUTBOUND',
                type: mediaType === 'image' ? 'IMAGE' : 'TEXT',
                content: mediaUrl ? `[Media: ${mediaType}] ${mediaUrl}\n${messageText}` : messageText,
                status: 'FAILED',
              }
            });
          } catch (e) {
            console.error('Error logging failed message to DB', e);
          }

          failedCount++;
          failedContacts.push(contact.phone);
        }
      }
    }
    return { 
      message: `Successfully sent message to ${sentCount} contacts. Failed: ${failedCount}.`,
      sentCount,
      failedCount,
      failedContacts
    };
  }

  async sendDirectMessage(phone: string, messageText: string, mediaType?: string, mediaUrl?: string, templateParams?: string[]) {
    try {
      // Ensure contact exists first so we can link the message to it
      let contact = await this.prisma.contact.findUnique({ where: { phone } });
      if (!contact) {
         let workspace = await this.prisma.workspace.findFirst();
         contact = await this.prisma.contact.create({
           data: { phone, workspaceId: workspace?.id || 'default', name: 'Manual Lead' }
         });
      }

      await this.whatsappService.sendMessage(phone, messageText, mediaType, mediaUrl, undefined, templateParams);

      // Save outbound message to database
      await this.prisma.message.create({
        data: {
          contactId: contact.id,
          direction: 'OUTBOUND',
          type: mediaType === 'template' ? 'TEMPLATE' : (mediaType === 'image' ? 'IMAGE' : 'TEXT'),
          content: mediaUrl ? `[Media: ${mediaType}] ${mediaUrl}\n${messageText}` : messageText,
          status: 'SENT',
        }
      });

      return { success: true };
    } catch (error) {
      console.error(`Failed to send direct message to ${phone}`, error);
      
      // Save failed outbound message if contact exists
      let contact = await this.prisma.contact.findUnique({ where: { phone } });
      if (contact) {
        try {
          await this.prisma.message.create({
            data: {
              contactId: contact.id,
              direction: 'OUTBOUND',
              type: mediaType === 'image' ? 'IMAGE' : 'TEXT',
              content: mediaUrl ? `[Media: ${mediaType}] ${mediaUrl}\n${messageText}` : messageText,
              status: 'FAILED',
            }
          });
        } catch (e) {
          console.error('Error logging failed message to DB', e);
        }
      }

      throw new Error('Failed to send message: ' + error.message);
    }
  }

  async create(data: Prisma.ContactCreateInput) {
    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await this.prisma.workspace.create({
        data: { name: 'Avani Loan Services Default' },
      });
    }

    const phone = data.phone;
    let contact = await this.prisma.contact.findUnique({ where: { phone } });

    if (contact) {
      // Reset contact status to NEW_LEAD and update attributes to restart the workflow
      contact = await this.prisma.contact.update({
        where: { id: contact.id },
        data: {
          name: data.name || contact.name,
          status: 'NEW_LEAD',
          loanAmount: null,
          income: null,
          profession: null
        }
      });
      // Delete old message history for this contact so the state machine starts clean
      await this.prisma.message.deleteMany({
        where: { contactId: contact.id }
      });
      console.log(`Reset existing contact ${phone} to restart qualification workflow.`);
    } else {
      const createData: any = { ...data };
      createData.workspace = { connect: { id: workspace.id } };
      contact = await this.prisma.contact.create({ data: createData });
      console.log(`Created new contact ${phone} for qualification workflow.`);
    }

    // Instantly trigger Stage 1: Lead Captured greeting message
    const welcomeMessage = `Hello ${contact.name || 'Valued Customer'}!\n\nThank you for contacting AVANI LOAN SERVICES.\n\nOur advisor will check your eligibility shortly.\n\nReply YES to continue.`;
    try {
      await this.whatsappService.sendMessage(contact.phone, welcomeMessage);
      
      // Save welcome message record to DB
      await this.prisma.message.create({
        data: {
          contactId: contact.id,
          direction: 'OUTBOUND',
          type: 'TEXT',
          content: welcomeMessage,
          status: 'SENT'
        }
      });
    } catch (e) {
      console.error(`Failed to send automated Stage 1 greeting to ${contact.phone}`, e);
    }

    return contact;
  }

  findAll() {
    return this.prisma.contact.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1, // include latest message
        }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });
  }

  async update(id: string, data: Prisma.ContactUpdateInput) {
    if (data.status) {
      const currentContact = await this.prisma.contact.findUnique({ where: { id } });
      if (currentContact && currentContact.status !== data.status) {
        let autoReplyMessage = '';
        const newStatus = data.status as string;
        
        switch (newStatus) {
          case 'CONTACT_ATTEMPTED':
            autoReplyMessage = 'Hi! We recently tried to reach you regarding your loan application. Please let us know a good time to connect. - Avani Loan Services';
            break;
          case 'QUALIFIED':
            autoReplyMessage = 'Great news! You have been preliminarily qualified for the loan. Our team will guide you on the next steps shortly.';
            break;
          case 'DOCS_REQUESTED':
            autoReplyMessage = 'Please submit your required documents to process your loan application faster. Check the list here: https://www.avanifinserv.com/documents';
            break;
          case 'DOCS_RECEIVED':
            autoReplyMessage = 'Thank you! We have received your documents. We will review them and update you on your eligibility.';
            break;
          case 'ELIGIBILITY_REVIEW':
            autoReplyMessage = 'Your profile is currently under Eligibility Review by our financial experts. We will share an update within 24 hours.';
            break;
          case 'LENDER_SUBMISSION':
            autoReplyMessage = 'Your application has been successfully submitted to our partner banks. We are negotiating the best rates for you!';
            break;
          case 'UNDER_PROCESS':
            autoReplyMessage = 'Your loan application is currently under process with the bank. We will notify you as soon as there is an update.';
            break;
          case 'APPROVED':
            autoReplyMessage = 'Congratulations! Your loan has been APPROVED! Our advisor will call you to discuss the final sanction letter.';
            break;
          case 'DISBURSED':
            autoReplyMessage = '🎉 Your loan amount has been successfully disbursed to your bank account! Thank you for choosing Avani Loan Services.';
            break;
          case 'REFERRAL_REQUESTED':
            autoReplyMessage = 'We hope you had a great experience with us! If you know anyone looking for a loan, please refer them to Avani Loan Services. We appreciate your support!';
            break;
        }

        if (autoReplyMessage && currentContact.phone) {
          try {
            await this.sendDirectMessage(currentContact.phone, autoReplyMessage);
          } catch (e) {
            console.error('Failed to send auto-reply for status update', e);
          }
        }
      }
    }

    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }

  async processCsv(fileBuffer: Buffer) {
    const csv = require('csv-parser');
    const { Readable } = require('stream');
    const validRows: any[] = [];
    const failedRows: any[] = [];

    return new Promise(async (resolve, reject) => {
      // Get the default workspace ID since we need it for contacts
      let workspace = await this.prisma.workspace.findFirst();
      if (!workspace) {
        workspace = await this.prisma.workspace.create({
          data: { name: 'Avani Loan Services Default' },
        });
      }
      const workspaceId = workspace.id;

      Readable.from(fileBuffer)
        .pipe(csv())
        .on('data', (data: any) => {
          const phoneKey = Object.keys(data).find(k => k.toLowerCase().trim() === 'phone' || k.toLowerCase().trim() === 'mobile' || k.toLowerCase().trim() === 'phone number');
          const nameKey = Object.keys(data).find(k => k.toLowerCase().trim() === 'name' || k.toLowerCase().trim() === 'full name');
          const cityKey = Object.keys(data).find(k => k.toLowerCase().trim() === 'city' || k.toLowerCase().trim() === 'location');
          const incomeKey = Object.keys(data).find(k => k.toLowerCase().trim() === 'income' || k.toLowerCase().trim() === 'monthly income' || k.toLowerCase().trim() === 'salary');
          const professionKey = Object.keys(data).find(k => k.toLowerCase().trim() === 'profession' || k.toLowerCase().trim() === 'occupation');
          const loanTypeKey = Object.keys(data).find(k => k.toLowerCase().trim() === 'loantype' || k.toLowerCase().trim() === 'loan type' || k.toLowerCase().trim() === 'product');
          const loanAmountKey = Object.keys(data).find(k => k.toLowerCase().trim() === 'loanamount' || k.toLowerCase().trim() === 'loan amount' || k.toLowerCase().trim() === 'amount');
          const propertyValueKey = Object.keys(data).find(k => k.toLowerCase().trim() === 'propertyvalue' || k.toLowerCase().trim() === 'property value' || k.toLowerCase().trim() === 'value');

          const rawPhone = phoneKey ? data[phoneKey] : null;
          const rawName = nameKey ? data[nameKey] : null;
          const rawCity = cityKey ? data[cityKey] : null;
          const rawIncome = incomeKey ? data[incomeKey] : null;
          const rawProfession = professionKey ? data[professionKey] : null;
          const rawLoanType = loanTypeKey ? data[loanTypeKey] : null;
          const rawLoanAmount = loanAmountKey ? data[loanAmountKey] : null;
          const rawPropertyValue = propertyValueKey ? data[propertyValueKey] : null;

          if (rawPhone && /^\+?[0-9]{10,15}$/.test(rawPhone.replace(/\s+/g, ''))) {
            validRows.push({
              phone: rawPhone.replace(/\s+/g, ''),
              name: rawName || null,
              city: rawCity || null,
              income: rawIncome ? parseFloat(rawIncome) : null,
              profession: rawProfession || null,
              loanType: rawLoanType || null,
              loanAmount: rawLoanAmount ? parseFloat(rawLoanAmount) : null,
              propertyValue: rawPropertyValue ? parseFloat(rawPropertyValue) : null,
              workspaceId: workspaceId,
            });
          } else {
            failedRows.push(data);
          }
        })
        .on('end', async () => {
          try {
            // Bulk insert while ignoring duplicates (phone must be unique)
            const created = await this.prisma.contact.createMany({
              data: validRows,
              skipDuplicates: true,
            });
            resolve({ 
              message: `Successfully imported ${created.count} contacts. Failed/Invalid: ${failedRows.length}.`,
              successCount: created.count,
              failedCount: failedRows.length,
              failedRows
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error: any) => reject(error));
    });
  }
}
