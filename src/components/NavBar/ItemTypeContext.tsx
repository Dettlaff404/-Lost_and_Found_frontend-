import { createContext, useContext, useState } from "react";

const ItemTypeContext = createContext<{ 
    selectedItemType: string; 
    setSelectedItemType: (type: string) => void; 
} | null>(null);

export const ItemTypeProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedItemType, setSelectedItemType] = useState("ALL");

    return (
        <ItemTypeContext.Provider value={{ selectedItemType, setSelectedItemType }}>
            {children}
        </ItemTypeContext.Provider>
    );
};

// Ensure we don’t destructure if context is missing
export const useItemType = () => {
    const context = useContext(ItemTypeContext);
    if (!context) {
        throw new Error("useItemType must be used within an ItemTypeProvider");
    }
    return context;
};