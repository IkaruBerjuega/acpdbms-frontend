// import { z } from 'zod';

// const MAX_FILE_SIZE = 5000000; // 5MB
// const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// // Define the Zod schema for the upload data
// export const UploadSchema = z.object({
//   content: z.string().min(1, 'Content is required'), // Content must be a non-empty string
//   images: z
//     .array(
//       z.object({
//         file: z
//           .union([
//             z
//               .instanceof(File)
//               .refine((file) => file.size <= MAX_FILE_SIZE, {
//                 message: `Max file size is ${MAX_FILE_SIZE / 1000000}MB`,
//               })
//               .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
//                 message: 'Only JPEG, PNG, and WEBP formats are supported',
//               }),
//             z.string().url('Invalid URL format'), // Accepts valid URLs for preloaded images
//           ])
//           .optional(),
//       })
//     )
//     .optional(), // Optional array of File objects or URLs
// });

// // Infer the TypeScript types from the schema
// export type UploadData = z.infer<typeof UploadSchema>;
