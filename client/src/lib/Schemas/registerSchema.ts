import { z } from "zod";

const passwordValidation = new RegExp( /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/);

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(passwordValidation, {
        message: 'Password must contain 1 lowercase character, 1 uppercase character, 1 number, 1 special and be 6-10 characters'
    }),
    
});

// export const registerSchema = z.object({
//     email: z.string().email(),

//     password: z.string()
//         .min(6, {
//             message: 'Password must be at least 6 characters'
//         })
//         .refine((password) => /[a-z]/.test(password), {
//             message: 'Password must contain 1 lowercase character'
//         })
//         .refine((password) => /[A-Z]/.test(password), {
//             message: 'Password must contain 1 uppercase character'
//         })
//         .refine((password) => /\d/.test(password), {
//             message: 'Password must contain 1 number'
//         })
//         .refine((password) => /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password), {
//             message: 'Password must contain 1 special character'
//         })
// });

export type RegisterSchema = z.infer<typeof registerSchema>;