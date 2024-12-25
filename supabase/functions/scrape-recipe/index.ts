import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import FirecrawlApp from 'npm:@mendable/firecrawl-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    console.log('Scraping recipe from URL:', url)

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY not found')
    }

    const firecrawl = new FirecrawlApp({ apiKey })
    const response = await firecrawl.crawlUrl(url, {
      limit: 1,
      scrapeOptions: {
        formats: ['markdown', 'html'],
        selectors: {
          title: ['h1', 'meta[property="og:title"]'],
          description: ['meta[name="description"]', 'meta[property="og:description"]'],
          image: ['meta[property="og:image"]', 'img[itemprop="image"]'],
          ingredients: ['[itemprop="recipeIngredient"]', '.recipe-ingredients'],
          instructions: ['[itemprop="recipeInstructions"]', '.recipe-instructions'],
          prepTime: ['[itemprop="prepTime"]'],
          cookTime: ['[itemprop="cookTime"]'],
          servings: ['[itemprop="recipeYield"]'],
        }
      }
    })

    console.log('Firecrawl response:', response)

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error scraping recipe:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})