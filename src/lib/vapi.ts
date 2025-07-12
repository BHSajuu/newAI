// /lib/vapi.ts
import Vapi from '@vapi-ai/web';

// Initialize with configuration object
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
