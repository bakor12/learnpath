// src/services/geminiApi.ts
import axios from 'axios';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key='; 

// Adjusted timeout for Gemini API requests (8 seconds)
// This change ensures we do not exceed Vercel free plan limits.
const GEMINI_TIMEOUT = 8000; 

if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key is not defined");
}

export const analyzeResume = async (resumeText: string, learningGoals: string[], userSkills: string[]) => {
  try {
    const prompt = `Analyze the following resume text and identify skills and skill gaps based on the provided learning goals and current skills.
        Resume Text: ${resumeText}
        Learning Goals: ${learningGoals.join(', ')}
        Current Skills: ${userSkills.join(', ')}
        Provide the analysis in JSON format, including:
        {
          "identifiedSkills": ["skill1", "skill2", ...],
          "skillGaps": ["gap1", "gap2", ...],
          "suggestedSkills": ["skill1", "skill2", ...]
        }
        `;

    const requestData = {
        contents: [{
            parts: [{
                text: prompt,
            }],
        }],
    };

    const response = await axios.post(`${GEMINI_API_URL}${GEMINI_API_KEY}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: GEMINI_TIMEOUT // Add timeout
    });

    // Extract the relevant data from the Gemini API response (adjust based on the actual response structure)
    if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0] && response.data.candidates[0].content.parts[0].text) {
        let generatedText = response.data.candidates[0].content.parts[0].text;

        // --- FIX: Extract JSON from Markdown ---
        const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            generatedText = jsonMatch[1]; // Use the extracted JSON
        } else {
            // Handle cases where the expected Markdown isn't found.
            console.error("Markdown code fence not found in Gemini API response:", generatedText);
            throw new Error("Unexpected response format from Gemini API (no Markdown code fence).");
        }
        // --- END FIX ---

        try {
            const parsedData = JSON.parse(generatedText);
            return parsedData;
        } catch (parseError) {
            console.error("Error parsing Gemini API response:", parseError);
            console.log("Raw Gemini API response:", generatedText); // Log the raw response
            throw new Error("Failed to parse Gemini API response");
        }
    } else {
        console.error("Unexpected Gemini API response format:", response.data);
        throw new Error("Unexpected Gemini API response format");
    }

  } catch (error: unknown) {
    // Check for timeout error specifically
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      console.error('Gemini API timeout:', error);
      throw new Error(`Gemini API timeout: The request took too long to complete`);
    }
    
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error('Gemini API error: An unknown error occurred');
  }
};

export const generateLearningPath = async (identifiedSkills: string[], skillGaps: string[], suggestedSkills: string[], learningStyle: string | undefined) => {
    try {
        const prompt = `Generate a learning path based on the following information:
        Identified Skills: ${identifiedSkills.join(', ')}
        Skill Gaps: ${skillGaps.join(', ')}
        Suggested Skills: ${suggestedSkills.join(', ')}
        Learning Style: ${learningStyle || 'Not specified'}

        Provide a learning path in JSON format, including an array of learning modules:
        [
          {
            "id": "module1",
            "title": "Module 1 Title",
            "description": "Module 1 Description",
            "estimatedTime": "2 hours",
            "difficulty": "beginner",
            "resourceLinks": ["link1", "link2"],
            "prerequisites": []
          },
          {
            "id": "module2",
            "title": "Module 2 Title",
            "description": "Module 2 Description",
            "estimatedTime": "3 hours",
            "difficulty": "intermediate",
            "resourceLinks": ["link3", "link4"],
            "prerequisites": ["module1"]
          }
          ...
        ]
        `;
        const requestData = {
            contents: [{
                parts: [{
                    text: prompt,
                }],
            }],
        };

        const response = await axios.post(`${GEMINI_API_URL}${GEMINI_API_KEY}`, requestData,{
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: GEMINI_TIMEOUT // Add timeout
        });

        if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0] && response.data.candidates[0].content.parts[0].text) {
            let generatedText = response.data.candidates[0].content.parts[0].text;

            // --- FIX: Extract JSON from Markdown ---
            const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                generatedText = jsonMatch[1]; // Use the extracted JSON
            } else {
                // Handle cases where the expected Markdown isn't found.
                console.error("Markdown code fence not found in Gemini API response:", generatedText);
                throw new Error("Unexpected response format from Gemini API (no Markdown code fence).");
            }
            // --- END FIX ---

            try {
                const parsedData = JSON.parse(generatedText);
                console.log("Parsed Data:", parsedData); // Added console.log
                return parsedData;
            } catch (parseError) {
                console.error("Error parsing Gemini API response:", parseError);
                throw new Error("Failed to parse Gemini API response");
            }
        } else {
            console.error("Unexpected Gemini API response format:", response.data);
            throw new Error("Unexpected Gemini API response format");
        }

    } catch (error:unknown) {
        // Check for timeout error specifically
        if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
          console.error('Gemini API timeout:', error);
          throw new Error(`Gemini API timeout: The request took too long to complete`);
        }
        
        console.error('Error calling Gemini API:', error);
        if (error instanceof Error) {
            throw new Error(`Gemini API error: ${error.message}`);
        }
        throw new Error('Gemini API error: An unknown error occurred');
    }
};

export const recommendResources = async (
    moduleTitle: string,
    moduleDescription: string | undefined,
    learningStyle: string | undefined,
    userSkills: string[]
  ) => {
    try {
      const prompt = `Recommend learning resources for a module titled "${moduleTitle}" with the following description:
        ${moduleDescription || 'No description provided.'}
  
        The user has the following learning style: ${learningStyle || 'Not specified'}
        The user's current skills include: ${userSkills.join(', ')}
  
        Provide recommendations in JSON format, as an array of resources:
        [
          {
            "title": "Resource Title",
            "description": "Resource Description",
            "url": "Resource URL",
            "type": "article" | "video" | "course" | "other"
          },
          ...
        ]
        `;
  
      const requestData = {
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      };
  
      const response = await axios.post(`${GEMINI_API_URL}${GEMINI_API_KEY}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: GEMINI_TIMEOUT // Add timeout
      });
  
        if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0] && response.data.candidates[0].content.parts[0].text) {
            let generatedText = response.data.candidates[0].content.parts[0].text;

            // --- FIX: Extract JSON from Markdown ---
            const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                generatedText = jsonMatch[1]; // Use the extracted JSON
            } else {
                // Handle cases where the expected Markdown isn't found.
                console.error("Markdown code fence not found in Gemini API response:", generatedText);
                throw new Error("Unexpected response format from Gemini API (no Markdown code fence).");
            }
            // --- END FIX ---
            try {
                const parsedData = JSON.parse(generatedText);
                return parsedData;
            } catch (parseError) {
                console.error("Error parsing Gemini API response:", parseError);
                throw new Error("Failed to parse Gemini API response");
            }
        } else {
            console.error("Unexpected Gemini API response format:", response.data);
            throw new Error("Unexpected Gemini API response format");
        }
    } catch (error: unknown) {
      // Check for timeout error specifically
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('Gemini API timeout:', error);
        throw new Error(`Gemini API timeout: The request took too long to complete`);
      }
      
      console.error('Error calling Gemini API for recommendations:', error);
      if (error instanceof Error) {
        throw new Error(`Gemini API recommendation error: ${error.message}`);
      }
      throw new Error('Gemini API recommendation error: Unknown error occurred');
    }
  };

  export const generateMotivationalMessage = async (completedModulesCount: number, learningGoals: string[], badges: string[]) => {
    try {
        const prompt = `Generate a motivational message for a user who has completed ${completedModulesCount} modules, 
        is working towards the following learning goals: ${learningGoals.join(', ')}, and has earned the following badges: ${badges.join(', ')}.`;

        const requestData = {
            contents: [{
                parts: [{
                    text: prompt,
                }],
            }],
        };
        const response = await axios.post(`${GEMINI_API_URL}${GEMINI_API_KEY}`, requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: GEMINI_TIMEOUT // Add timeout
        });
        if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0] && response.data.candidates[0].content.parts[0].text) {
            const generatedText = response.data.candidates[0].content.parts[0].text;
            return generatedText; // Return plain text
        } else {
            console.error("Unexpected Gemini API response format:", response.data);
            throw new Error("Unexpected Gemini API response format");
        }

    } catch (error: unknown) {
      // Check for timeout error specifically
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('Gemini API timeout:', error);
        throw new Error(`Gemini API timeout: The request took too long to complete`);
      }
      
      console.error('Error calling Gemini API for motivation:', error);
      if (error instanceof Error) {
        throw new Error(`Gemini API motivation error: ${error.message}`);
      }
      throw new Error('Gemini API motivation error: Unknown error occurred');
    }
};