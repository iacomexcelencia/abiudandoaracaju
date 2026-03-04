import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import logoAbiudando from "@assets/logo-abiudando-aracaju.png";

const loginSchema = z.object({
  emailPrefix: z.string().min(1, "Digite seu email"),
  password: z.string().min(1, "Digite sua senha"),
  rememberEmail: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailPrefix: localStorage.getItem("rememberedEmail") || "",
      password: "",
      rememberEmail: !!localStorage.getItem("rememberedEmail"),
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      const result = await login(data.emailPrefix, data.password);
      
      if (result.success) {
        if (data.rememberEmail) {
          localStorage.setItem("rememberedEmail", data.emailPrefix);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        
        toast({
          title: "Bem-vindo!",
          description: "Login realizado com sucesso",
        });
        
        setLocation("/admin");
      } else {
        toast({
          title: "Erro no login",
          description: result.error || "Email ou senha incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header com logomarca maior */}
      <div className="bg-white pt-12 pb-2 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-center px-4">
          <img 
            src={logoAbiudando} 
            alt="ABIUDANDO ARACAJU" 
            className="h-64 md:h-80 w-auto object-contain transition-all duration-300"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Sistema ABIUDANDO ARACAJU
          </h1>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
                Entrar no Sistema
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="emailPrefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              {...field}
                              placeholder="seu.nome"
                              className="rounded-r-none border-r-0"
                              disabled={isLoading}
                            />
                            <div className="flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600 text-sm">
                              @aracaju.se.gov.br
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rememberEmail"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Lembrar meu email neste dispositivo
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Footer com logo da Secretaria */}
          <div className="mt-8 text-center">
            <img
              src="https://pub-872633efa2d545638be12ea86363c2ca.r2.dev/setur-logo.png"
              alt="Secretaria Municipal de Turismo"
              className="h-16 mx-auto mb-4"
            />
            <p className="text-sm text-gray-500">
              Secretaria Municipal de Turismo de Aracaju
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
