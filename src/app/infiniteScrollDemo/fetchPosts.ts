const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchPosts = async (page, limit) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    );
    const data = await response.json();
    await sleep(1000);
    return data;
  };

