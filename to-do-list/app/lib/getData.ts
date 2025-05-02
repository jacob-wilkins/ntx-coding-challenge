export default async function getData(): Promise<{ userId: number; id: number; title: string; completed: boolean }[]> {
    const source = "https://jsonplaceholder.typicode.com/todos";
  
    try {
      const resp = await fetch(source);

      if (!resp.ok) throw new Error(`Status: ${resp.status}`);

      const json = await resp.json();
      return json;
    } catch (e) {
      console.error((e as Error).message);

      // Fallback to empty array on error
      return []; 
    }
  }
  