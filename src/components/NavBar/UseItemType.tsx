import { useMemo, useState } from "react";

const useItemType = (method: string) => {
  const [selectedItemType, setSelectedItemType] = useState("ALL");
  const cachedItemType = useMemo(() => selectedItemType, [selectedItemType]);

  if (method === "set") {
    return setSelectedItemType;
  } else if (method === "get") {
    return cachedItemType;
  } else {
    throw new Error("Invalid method");
  }
};

export default useItemType;