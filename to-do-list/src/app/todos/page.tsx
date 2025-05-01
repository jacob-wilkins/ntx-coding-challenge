// using async for concurrency
async function getData() {
    const url = "https://jsonplaceholder.typicode.com/todos";

    // try to get data, handles errors if they pop up
    try {
        // wait on the fetch
        const resp = await fetch(url);

        if (!resp.ok) throw new Error(`Fetch response: ${resp.status}`);

        const json = await resp.json();
        console.log(json)
    } catch (error) {
        console.error(error.message)
    }
}


export default function List() {
    return(

    );
}