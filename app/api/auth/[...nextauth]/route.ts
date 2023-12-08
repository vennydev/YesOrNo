import firestore from "@/firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import NextAuth from "next-auth/next";
import KakaoProvider from "next-auth/providers/kakao";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks : {
    async signIn({ user }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        await setDoc(doc(firestore, 'users', user.id), {
          id: user.id,
          name: user.name,
          email: user.email,
          myPost: [],
        });

        return true
      } else {
        console.log('로그인에 실패했습니다.')
        return false
      }
    },
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = user?.id
      }
      return token
    },
    async session({ session, user, token }) {
      session.user.id = token.id as any;
      return session
    },
  }
});

export { handler as GET, handler as POST };