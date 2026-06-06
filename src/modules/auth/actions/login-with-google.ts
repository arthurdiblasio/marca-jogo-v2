import { userRepository } from "../repositories/user-repository";

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
}

export async function loginWithGoogle(googleUser: GoogleUser) {
  const existingGoogleUser = await userRepository.findByGoogleId(
    googleUser.sub,
  );

  if (existingGoogleUser) {
    return existingGoogleUser;
  }

  const existingEmailUser = await userRepository.findByEmail(googleUser.email);

  if (existingEmailUser) {
    return userRepository.updateGoogleId(existingEmailUser.id, googleUser.sub);
  }

  return userRepository.createGoogleUser({
    googleId: googleUser.sub,
    email: googleUser.email,
    fullName: googleUser.name,
  });
}
