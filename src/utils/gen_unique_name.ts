export const genUserName = (): string => {
    const usernamePrefix = 'user-';
    const randomChars = Math.random().toString(36).slice(2);

    const username = usernamePrefix + randomChars;

    return username;
}

export const genSlug = (title: string) => {
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')     // remove special characters except spaces and dashes
        .replace(/\s+/g, '-')         // replace spaces with dashes
        .replace(/-+/g, '-');         // collapse multiple dashes into one

    const randomChars = Math.random().toString(36).slice(2, 8); 
    return `${slug}-${randomChars}`;
};