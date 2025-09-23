"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

const onboardingSchema = z.object({
  fullName: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  businessName: z.string().min(2, { message: "O nome do negócio deve ter pelo menos 2 caracteres." }),
  monthlyGoal: z.coerce.number({ invalid_type_error: "Insira um número." }).positive("O valor deve ser positivo."),
  businessGoals: z.string().min(10, { message: "Descreva seus objetivos em pelo menos 10 caracteres." }),
  appColor: z.string().min(1, { message: "Escolha uma cor para o app." }),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const appColors = [
  { id: "default", name: "Rosa Moderno", bg: "bg-pink-500" },
  { id: "blue", name: "Azul Sereno", bg: "bg-blue-500" },
  { id: "green", name: "Verde Menta", bg: "bg-green-500" },
  { id: "orange", name: "Laranja Vibrante", bg: "bg-orange-500" },
];

const steps = [
  { id: "welcome", title: "Bem-vinda ao EsteticaAI!", description: "Vamos começar a configurar sua conta para aproveitar ao máximo a plataforma.", fields: [] },
  { id: "account", title: "Crie sua conta", description: "Informações básicas para acessar seu painel.", fields: ["fullName", "email", "password"] },
  { id: "businessName", title: "Nome do seu negócio", description: "Como ele será exibido no painel e em comunicações.", fields: ["businessName"] },
  { id: "monthlyGoal", title: "Meta de faturamento mensal", description: "Nos ajuda a fornecer insights personalizados.", fields: ["monthlyGoal"] },
  { id: "businessGoals", title: "Principais metas", description: "Ex: Aumentar clientes, fidelizar atuais, ter mais tempo livre.", fields: ["businessGoals"] },
  { id: "appColor", title: "Escolha uma cor para o app", description: "Deixe o EsteticaAI com a sua cara.", fields: ["appColor"] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { fullName: "", email: "", password: "", businessName: "", monthlyGoal: 5000, businessGoals: "", appColor: "" },
    mode: "onChange",
  });

  const { trigger, handleSubmit, watch, formState } = form;
  const selectedColor = watch("appColor");

  useEffect(() => {
    if (selectedColor) setTheme(selectedColor);
  }, [selectedColor, setTheme]);

  async function handleNext() {
    const fields = steps[currentStep].fields as (keyof OnboardingFormValues)[];
    const isValid = await trigger(fields);
    if (isValid || fields.length === 0) {
      if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }

  function onSubmit(data: OnboardingFormValues) {
    console.log(data);
    router.push("/dashboard");
  }

  const progress = (currentStep / (steps.length - 1)) * 100;
  const canFinish = selectedColor !== "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-50 to-blue-50 p-6">
      <Card className="w-full max-w-3xl shadow-xl rounded-3xl flex flex-col min-h-[650px] overflow-hidden">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <CardHeader className="text-center py-8 bg-gradient-to-b from-white/90 to-white/70">
              <div className="flex justify-center items-center gap-4 mb-4">
                <Icons.logo className="h-12 w-12 text-primary" />
                <h1 className="text-4xl font-serif font-bold text-foreground">EsteticaAI</h1>
              </div>
              <p className="text-muted-foreground text-lg">Configure seu perfil em alguns passos simples.</p>
              <Progress value={progress} className="w-full h-3 mt-6 rounded-full" />
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-center items-center overflow-hidden px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="max-w-lg w-full"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold">{steps[currentStep].title}</h2>
                    <p className="text-muted-foreground mt-2">{steps[currentStep].description}</p>
                  </div>

                  <div className="min-h-[220px] flex flex-col items-center justify-center gap-4 w-full">
                    {/* Welcome */}
                    {currentStep === 0 && <p className="text-xl text-center">Seja bem-vinda! Clique em "Começar" para iniciar o onboarding.</p>}

                    {/* Account */}
                    {currentStep === 1 && (
                      <div className="space-y-4 w-full">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                          <FormItem><Label>Nome Completo</Label><FormControl><Input {...field} placeholder="Ex: Ana Silva" className="p-4 text-lg" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem><Label>E-mail</Label><FormControl><Input type="email" {...field} placeholder="exemplo@email.com" className="p-4 text-lg" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                          <FormItem><Label>Senha</Label><FormControl><Input type="password" {...field} placeholder="Mínimo 6 caracteres" className="p-4 text-lg" /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                    )}

                    {/* Business Name */}
                    {currentStep === 2 && (
                      <FormField control={form.control} name="businessName" render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl><Input {...field} placeholder="Ex: Espaço Beleza Pura" className="text-center text-lg p-6 rounded-xl shadow-sm" /></FormControl>
                          <FormMessage className="text-center" />
                        </FormItem>
                      )} />
                    )}

                    {/* Monthly Goal */}
                    {currentStep === 3 && (
                      <FormField control={form.control} name="monthlyGoal" render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl><Input type="number" {...field} placeholder="Ex: 5000" className="text-center text-lg p-6 rounded-xl shadow-sm" /></FormControl>
                          <FormMessage className="text-center" />
                        </FormItem>
                      )} />
                    )}

                    {/* Business Goals */}
                    {currentStep === 4 && (
                      <FormField control={form.control} name="businessGoals" render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Textarea {...field} placeholder="Ex: Aumentar minha base de clientes, fidelizar as atuais, ter mais tempo livre..." className="min-h-[140px] text-lg text-center p-4 rounded-xl shadow-sm" />
                          </FormControl>
                          <FormMessage className="text-center" />
                        </FormItem>
                      )} />
                    )}

                    {/* App Color */}
                    {currentStep === 5 && (
                      <FormField
                        control={form.control}
                        name="appColor"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <RadioGroup
                              value={field.value}
                              onValueChange={(value) => field.onChange(value)}
                              className="grid grid-cols-2 gap-4"
                            >
                              {appColors.map((color) => (
                                <Label
                                  key={color.id}
                                  htmlFor={color.id}
                                  className={cn(
                                    "flex flex-col items-center justify-center rounded-xl border-2 p-5 cursor-pointer transition-all duration-300",
                                    field.value === color.id
                                      ? "border-primary scale-105 shadow-md"
                                      : "border-muted bg-muted/20 hover:border-muted-foreground/60"
                                  )}
                                >
                                  <input
                                    type="radio"
                                    id={color.id}
                                    value={color.id}
                                    checked={field.value === color.id}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="hidden"
                                  />
                                  <div className="flex items-center gap-3 w-full justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={cn("w-6 h-6 rounded-full", color.bg)} />
                                      <span className="font-medium">{color.name}</span>
                                    </div>
                                    {field.value === color.id && <Check className="h-6 w-6 text-primary" />}
                                  </div>
                                </Label>
                              ))}
                            </RadioGroup>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>

            <CardFooter className="mt-auto border-t pt-6 px-6">
              <div className="w-full flex justify-between items-center">
                <Button type="button" variant="ghost" onClick={handleBack} className={cn(currentStep === 0 ? "invisible" : "visible")}>Voltar</Button>

                <div className="flex items-center gap-2">
                  {steps.map((step, idx) => (
                    <div key={step.id} className={cn("h-3 w-3 rounded-full transition-colors", currentStep >= idx ? "bg-primary" : "bg-muted")} />
                  ))}
                </div>

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>{currentStep === 0 ? "Começar" : "Próximo"}</Button>
                ) : (
                  <Button type="submit" size="lg" disabled={!canFinish}>Concluir e ir para o Painel</Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
