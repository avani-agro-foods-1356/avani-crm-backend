import { redirect } from 'next/navigation';

export default function BroadcastsRedirect() {
  redirect('/campaigns');
}
