import { get_encoding } from "tiktoken";

let encoder: any = null;

const get_token_count = (text: string): number => {
	try {
    if (!encoder) {
      encoder = get_encoding("cl100k_base");
    }
    return encoder.encode(text).length;
  } catch (error) {
    console.error('Error counting tokens:', error);
    return 0;
  }
};

// To be called when component unmounts
export function cleanupEncoder() {
  if (encoder) {
    encoder.free();
    encoder = null;
  }
}

export default get_token_count;