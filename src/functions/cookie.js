const cookieParser = () => (document.cookie.split(";")
    .map(cookie => ({
        key: cookie.split("=")[0].trim(),
        value: cookie.split("=")[1]?.trim()
    })));

export { cookieParser };