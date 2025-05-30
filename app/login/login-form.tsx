"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginForm as LoginFormSchema, loginSchema } from "./schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const {signIn} = useAuth();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })  

  async function onSubmit({email, password}: LoginFormSchema) {
    try {

      await signIn(email, password);
   
      toast.success("Login successful!");
      router.push("/dashboard");

    } catch (error: unknown) {
      
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
      return;

    }
  } 

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6 font-jakarta", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            {...register("email")} 
            id="email" name="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
          />
          {errors.email?.message && <p className="text-sm font-medium text-red-500">{errors.email.message}</p>}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input 
            {...register("password")}
            id="password" 
            name="password" 
            type="password" 
            required 
          />
          {errors.password?.message && <p className="text-sm font-medium text-red-500">{errors.password.message}</p>}
        </div>
        <Button  type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
