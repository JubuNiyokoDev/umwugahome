
'use server';

/**
 * @fileOverview Provides personalized guidance to new users via a Gemini-powered chatbot.
 *
 * - chatbotGuidedOrientation - A function that provides personalized guidance to new users.
 * - ChatbotGuidedOrientationInput - The input type for the chatbotGuidedOrientation function.
 * - ChatbotGuidedOrientationOutput - The return type for the chatbotGuidedOrientation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getFirestore, collection, getDocs, query, where, DocumentData, limit } from 'firebase/firestore';
import { firebaseApp } from '@/firebase/config'; 


// Helper to get Firestore instance
function getDb() {
  return getFirestore(firebaseApp);
}

const searchArtisansTool = ai.defineTool(
    {
        name: 'searchArtisans',
        description: 'Search for artisans based on craft or location.',
        inputSchema: z.object({
            query: z.string().describe('The craft or name of the artisan to search for.'),
            location: z.string().optional().describe('The province to filter artisans by.'),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            craft: z.string(),
            province: z.string(),
        })),
    },
    async ({ query: craftQuery, location }) => {
        console.log(`Searching artisans with query: ${craftQuery} in ${location}`);
        const db = getDb();
        const artisansRef = collection(db, 'artisans');
        
        let q = query(artisansRef, where('craft', '>=', craftQuery), where('craft', '<=', craftQuery + '\uf8ff'));

        if (location) {
            q = query(artisansRef, where('craft', '>=', craftQuery), where('craft', '<=', craftQuery + '\uf8ff'), where('province', '==', location));
        }

        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            // Fallback search by name if craft search yields no results
             let nameQuery = query(artisansRef, where('name', '>=', craftQuery), where('name', '<=', craftQuery + '\uf8ff'));
             if(location){
                nameQuery = query(artisansRef, where('name', '>=', craftQuery), where('name', '<=', craftQuery + '\uf8ff'), where('province', '==', location));
             }
             const nameSnapshot = await getDocs(nameQuery);
             return nameSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    }
);

const searchTrainingCentersTool = ai.defineTool(
    {
        name: 'searchTrainingCenters',
        description: 'Search for training centers.',
        inputSchema: z.object({
            query: z.string().describe('The name of the training center to search for.'),
            location: z.string().optional().describe('The province to filter training centers by.'),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            province: z.string(),
            description: z.string(),
        })),
    },
    async ({ query: nameQuery, location }) => {
        console.log(`Searching training centers with query: ${nameQuery} in ${location}`);
        const db = getDb();
        const centersRef = collection(db, 'training-centers');

        let q = query(centersRef, where('name', '>=', nameQuery), where('name', '<=', nameQuery + '\uf8ff'));
        if(location){
            q = query(centersRef, where('name', '>=', nameQuery), where('name', '<=', nameQuery + '\uf8ff'), where('province', '==', location));
        }
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    }
);

const searchProductsTool = ai.defineTool(
    {
        name: 'searchProducts',
        description: 'Search for products. Can be a general query to see available products.',
        inputSchema: z.object({
            query: z.string().optional().describe('The name of the product to search for. If empty, returns a list of available products.'),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            description: z.string(),
        })),
    },
    async ({ query: nameQuery }) => {
        console.log(`Searching products with query: ${nameQuery}`);
        const db = getDb();
        const productsRef = collection(db, 'products');

        let q;
        if (nameQuery) {
            q = query(productsRef, where('name', '>=', nameQuery), where('name', '<=', nameQuery + '\uf8ff'), limit(10));
        } else {
            q = query(productsRef, limit(10));
        }
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    }
);

const searchMentorsTool = ai.defineTool(
    {
        name: 'searchMentors',
        description: 'Search for mentors based on their expertise.',
        inputSchema: z.object({
            expertise: z.string().describe('The area of expertise to search for.'),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            expertise: z.string(),
            province: z.string(),
        })),
    },
    async ({ expertise }) => {
        console.log(`Searching mentors with expertise: ${expertise}`);
        const db = getDb();
        const mentorsRef = collection(db, 'mentors');
        const q = query(mentorsRef, where('expertise', '>=', expertise), where('expertise', '<=', expertise + '\uf8ff'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    }
);


const ChatbotGuidedOrientationInputSchema = z.object({
  query: z.string().describe('The user query or question for the chatbot.'),
});
export type ChatbotGuidedOrientationInput = z.infer<typeof ChatbotGuidedOrientationInputSchema>;

const ChatbotGuidedOrientationOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});
export type ChatbotGuidedOrientationOutput = z.infer<typeof ChatbotGuidedOrientationOutputSchema>;

export async function chatbotGuidedOrientation(input: ChatbotGuidedOrientationInput): Promise<ChatbotGuidedOrientationOutput> {
  return chatbotGuidedOrientationFlow(input);
}

const chatbotGuidedOrientationPrompt = ai.definePrompt({
  name: 'chatbotGuidedOrientationPrompt',
  input: {schema: ChatbotGuidedOrientationInputSchema},
  output: {schema: ChatbotGuidedOrientationOutputSchema},
  tools: [searchArtisansTool, searchTrainingCentersTool, searchProductsTool, searchMentorsTool],
  prompt: `You are a helpful chatbot on the UmwugaHome platform, designed to guide new users.

  Your goal is to help users discover relevant artisan profiles, training programs, mentors, and market opportunities based on their interests and skills.
  Use the available tools to search the platform's data for artisans, training centers, products, and mentors.
  
  You must detect the language of the user's query and respond in the SAME language. You must support English, French, Swahili, and pure Kirundi (do not mix with Kinyarwanda).

  When you find information, present it clearly. For example, if you find an artisan, provide their name, craft, and province.
  If you find multiple items, present them as a list.
  If a user asks a general question to see items (like "show me products" or "nshaka ibidandazwa"), use the appropriate tool without a specific query argument to show them available items.
  If you don't find anything, say so politely.

  When providing lists, format them nicely using markdown. For products, always include the price in FBU.
  For example:
  "Voici quelques produits qui pourraient vous intéresser :
  - **Panier en jonc 'Umuco'** - 25000 FBU
  - **Sac en cuir 'Kazoza'** - 75000 FBU"

  Respond to the following user query:
  {{{query}}}

  Be concise and helpful.
  If the query is not related to the platform or the tools cannot help, politely indicate that you can only answer questions about UmwugaHome.
  `,
});

const chatbotGuidedOrientationFlow = ai.defineFlow(
  {
    name: 'chatbotGuidedOrientationFlow',
    inputSchema: ChatbotGuidedOrientationInputSchema,
    outputSchema: ChatbotGuidedOrientationOutputSchema,
  },
  async input => {
    const {output} = await chatbotGuidedOrientationPrompt(input);
    return output!;
  }
);
