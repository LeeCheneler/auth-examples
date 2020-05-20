import React from "react";
import { createApiClient } from "../../api/client";
import { useAuth } from "../auth-provider";

interface Item {
  id: number;
  title: string;
}

export const Items = () => {
  const auth = useAuth();
  const [items, setItems] = React.useState<Item[]>([]);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (auth.isAuthenticated()) {
      const fetchItems = async () => {
        try {
          const fetchedItems = await createApiClient({
            accessToken: auth.user?.access_token,
          }).items.get();

          setItems(fetchedItems.data);
        } catch (e) {
          setError(e);
        }
      };

      fetchItems();
    }
  }, [auth]);

  return (
    <>
      <h2>Items</h2>
      {error && <span>Oops, failed to load items!</span>}
      {items.length > 0 && (
        <ul>
          {items.map((i) => (
            <li key={i.id}>{i.title}</li>
          ))}
        </ul>
      )}
    </>
  );
};
