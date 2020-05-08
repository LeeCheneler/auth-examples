import React from "react";
import { useAuth } from "./auth-provider";

interface Item {
  id: number;
  title: string;
}

export const Items = () => {
  const { getUser } = useAuth();
  const [items, setItems] = React.useState<Item[]>([]);

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const user = await getUser();
        const fetchedItems = await fetch("http://localhost:3000/api/items", {
          headers: { Authorization: `Bearer ${user?.access_token}` },
        }).then((r) => r.json());

        setItems(fetchedItems);
      } catch (e) {
        console.error(e);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <h2>Items</h2>
      <ul>
        {items.map((i) => (
          <li key={i.id}>{i.title}</li>
        ))}
      </ul>
    </>
  );
};
