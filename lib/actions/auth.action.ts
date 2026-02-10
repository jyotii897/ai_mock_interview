export const signIn = async (data: any) => {
    console.log("Mock sign in", data);
    return { success: true, message: "Sign in successful" };
}

export const signUp = async (data: any) => {
    console.log("Mock sign up", data);
    return { success: true, message: "Account created successfully" };
}
