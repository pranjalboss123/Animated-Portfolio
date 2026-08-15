import "./globals.css";
import "./motion.css";
import "./refinements.css";

export const metadata = {
  title: "Rishikesh Gupta | Full Stack Developer",
  description: "Portfolio of Rishikesh Gupta, a full stack developer building scalable, AI-integrated web applications.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
