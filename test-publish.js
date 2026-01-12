async function testPublish() {
  console.log('Testing /api/publish endpoint...\n');
  
  const testData = {
    imageUrl: 'https://example.com/test-image.png',
    prompt: 'A test image from the API'
  };
  
  const response = await fetch('http://localhost:3000/api/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
  });
  
  const data = await response.json();
  
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  if (response.status === 201) {
    console.log('\n✅ SUCCESS! Image published with ID:', data.id);
  } else {
    console.log('\n❌ ERROR:', data.error);
  }
}

testPublish();