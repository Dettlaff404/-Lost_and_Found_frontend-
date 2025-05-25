const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 10);
    } catch (error) {
        console.error("Error parsing date:", error);
        return "";
    }
  
};


export { formatDate };