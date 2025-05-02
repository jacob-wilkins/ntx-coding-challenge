export default async function getData(): Promise<{ userId: number; id: number; title: string; completed: boolean }[]> {
  const source = "https://jsonplaceholder.typicode.com/todos";

  try {
    const resp = await fetch(source);

    if (!resp.ok) throw new Error(`Status: ${resp.status}`);

    console.log(resp)

    const json = await resp.json();
    
    // looked up algorithm to shuffle this json: Fisher-Yates Shuffle
    // I could've imported something to do this, but it felt unnessary
    for (let i = json.length - 1; i > 0; i--) {
      // get random value based on i 
      const j = Math.floor(Math.random() * (i + 1));

      // swap values of i and j
      [json[i], json[j]] = [json[j], json[i]];
    }

    // return first 3 values
    return json.slice(0,3);
  } catch (e) {
    console.error((e as Error).message);

    // Fallback to empty array on error
    return []; 
  }
}
  