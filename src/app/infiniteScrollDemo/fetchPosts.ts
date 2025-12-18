
import { useLoadingConfig } from "./LoadingContext";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useFetchPosts =  () => {
  const { delay, itemsPerPage } = useLoadingConfig();
  const fetchPosts = async (page: number) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${itemsPerPage}`
    );
    await sleep(delay * 1000);
    const data = await response.json();
    return data;
  }
  return { fetchPosts };
};


export const useFetchTodos =  () => {
  const { delay, itemsPerPage } = useLoadingConfig();
  const fetchtods = async (page: number) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${itemsPerPage}`
    );
    await sleep(delay * 1000 + 500); // Ensure that todos are loaded at a different time than posts
    const data = await response.json();
    return data;
  }
  return { fetchtods };
};