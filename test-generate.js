async function testGenerate() {
  const response = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'a cute cat' })
  });
  
  const data = await response.json();
  console.log('Response:', data);
}

testGenerate();