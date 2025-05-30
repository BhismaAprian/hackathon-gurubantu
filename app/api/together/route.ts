import Together from 'together-ai';


export async function GET() {
  const together = new Together({
    apiKey: "2c7315b858eef48bf960adc241681c6e2bacbadf10ea29bd0a4c5fb788ae158e"
  });

  const chat = await together.chat.completions.create({
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    messages: [{ role: 'user', content: 'Top 3 things to do in New York?' }],
  });



  return Response.json({
    message: "Hello, World! This is a simple API endpoint.",
    chat,
  });
}
