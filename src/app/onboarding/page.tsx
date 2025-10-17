
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, Building, UserPlus, PartyPopper, Palette, Target, Loader2 } from "lucide-react";
import { Logo } from "../../components/logo";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

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
  { id: "default", name: "Roxo", theme: "default", bg: "bg-violet-600", border: "ring-violet-500" },
  { id: "pink", name: "Rosa Moderno", theme: "pink", bg: "bg-pink-500", border: "ring-pink-500" },
  { id: "blue", name: "Azul Sereno", theme: "blue", bg: "bg-blue-500", border: "ring-blue-500" },
  { id: "green", name: "Verde Menta", theme: "green", bg: "bg-green-500", border: "ring-green-500" },
  { id: "orange", name: "Laranja Vibrante", theme: "orange", bg: "bg-orange-500", border: "ring-orange-500" },
];

const steps = [
  { id: "welcome", title: "Bem-vinda ao EsteticaAI!", description: "Vamos configurar sua conta em poucos passos.", icon: PartyPopper, image: "https://images.unsplash.com/photo-1597007238289-e85b953c9f65?q=80&w=1964&auto=format&fit=crop" },
  { id: "account", title: "Crie sua conta", description: "Informações básicas para acessar seu painel.", fields: ["fullName", "email", "password"], icon: UserPlus, image: "https://images.unsplash.com/photo-1616401784845-1808224c3d0f?q=80&w=2070&auto=format&fit=crop" },
  { id: "businessInfo", title: "Sobre seu negócio", description: "Conte-nos sobre sua empresa e suas metas.", fields: ["businessName", "monthlyGoal"], icon: Building, image: "https://images.unsplash.com/photo-1621607512022-6ae5979929d3?q=80&w=2070&auto=format&fit=crop" },
  { id: "businessGoals", title: "Quais suas metas?", description: "Ex: Aumentar clientes, fidelizar atuais, etc.", fields: ["businessGoals"], icon: Target, image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop" },
  { id: "appColor", title: "Escolha a cara do seu app", description: "Selecione a cor que mais combina com você.", fields: ["appColor"], icon: Palette, image: "https://images.unsplash.com/photo-1560066982-9699a607108a?q=80&w=1974&auto=format&fit=crop" },
  { id: "final", title: "Tudo pronto!", description: "Sua configuração foi concluída com sucesso.", icon: Check, image: "https://images.unsplash.com/photo-1600965962102-4d4526376020?q=80&w=2070&auto=format&fit=crop" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      businessName: "",
      monthlyGoal: 5000,
      businessGoals: "",
      appColor: "default",
    },
    mode: "onChange",
  });

  const { trigger, handleSubmit, watch, control } = form;
  const selectedColor = watch("appColor");

  useEffect(() => {
    if (selectedColor) {
      const selectedTheme = appColors.find(c => c.id === selectedColor)?.theme || 'default';
      setTheme(selectedTheme);
    }
  }, [selectedColor, setTheme]);

  const isFinalStep = currentStep === steps.length - 2;

  async function handleNext() {
    const fields = steps[currentStep].fields as (keyof OnboardingFormValues)[] | undefined;
    const isValidStep = fields ? await trigger(fields, { shouldFocus: true }) : true;

    if (isValidStep) {
      if (currentStep < steps.length - 1) {
        if (isFinalStep) {
            await onSubmit(form.getValues());
        } else {
             setCurrentStep(prev => prev + 1);
        }
      }
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  }

  async function onSubmit(data: OnboardingFormValues) {
    if (isFinalStep && !data.appColor) {
        toast({
            title: "Atenção",
            description: "Por favor, escolha uma cor para o seu aplicativo.",
            variant: "destructive",
        });
        return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Ocorreu um problema.");
      
      setCurrentStep(prev => prev + 1);
      
      setTimeout(() => {
          router.push("/dashboard");
      }, 2000);


    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  const CurrentIcon = steps[currentStep].icon;

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40">
      <div className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl md:h-[600px] md:flex-row">

        {/* --- Painel Esquerdo (Formulário) --- */}
        <div className="flex w-full flex-col justify-between p-8 md:w-1/2">
            <div className="flex items-center justify-between">
                <Logo className="h-8 w-auto text-foreground" />
                <span className="text-sm text-muted-foreground">{`Etapa ${currentStep + 1} de ${steps.length}`}</span>
            </div>

            <div className="flex-grow">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
                <div className="flex-grow">
                    <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex h-full flex-col justify-center"
                    >
                      <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <CurrentIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">{steps[currentStep].title}</h2>
                          <p className="text-muted-foreground">{steps[currentStep].description}</p>
                        </div>
                      </div>
                        
                        <div className="w-full space-y-4">
                          {currentStep === 0 && (
                            <div className="py-8">
                              <p className="text-lg">Estamos felizes em ter você aqui. <br/>Clique em "Começar" para iniciar.</p>
                            </div>
                          )}
                          {currentStep === 1 && (
                              <>
                              <FormField control={control} name="fullName" render={({ field }) => (
                                  <FormItem><Label>Nome Completo</Label><FormControl><Input {...field} placeholder="Ex: Ana Silva" /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={control} name="email" render={({ field }) => (
                                  <FormItem><Label>E-mail</Label><FormControl><Input type="email" {...field} placeholder="exemplo@email.com" /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={control} name="password" render={({ field }) => (
                                  <FormItem><Label>Senha</Label><FormControl><Input type="password" {...field} placeholder="Mínimo 6 caracteres" /></FormControl><FormMessage /></FormItem>
                              )} />
                              </>
                          )}
                          {currentStep === 2 && (
                              <>
                              <FormField control={control} name="businessName" render={({ field }) => (
                                  <FormItem><Label>Nome do seu negócio</Label><FormControl><Input {...field} placeholder="Ex: Espaço Beleza Pura" /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={control} name="monthlyGoal" render={({ field }) => (
                                  <FormItem><Label>Meta de Faturamento (R$)</Label><FormControl><Input type="number" {...field} placeholder="Ex: 5000" /></FormControl><FormMessage /></FormItem>
                              )} />
                              </>
                          )}
                          {currentStep === 3 && (
                              <FormField control={control} name="businessGoals" render={({ field }) => (
                              <FormItem><Label>Quais são suas principais metas?</Label><FormControl><Textarea {...field} placeholder="Ex: Aumentar minha base de clientes..." className="min-h-[120px] resize-none" /></FormControl><FormMessage /></FormItem>
                              )} />
                          )}
                          {currentStep === 4 && (
                              <FormField control={control} name="appColor" render={({ field }) => (
                              <FormItem className="space-y-4">
                                  <FormControl>
                                  <div className="grid grid-cols-5 gap-4 pt-4">
                                      {appColors.map(color => (
                                      <label key={color.id} htmlFor={color.id} className={cn(
                                          "relative flex flex-col items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all duration-200 aspect-square",
                                          "hover:scale-105",
                                          field.value === color.id ? `ring-2 ring-offset-2 ring-offset-card ${color.border} scale-105` : "border-transparent",
                                      )}>
                                          <input type="radio" id={color.id} value={color.id} checked={field.value === color.id} onChange={e => field.onChange(e.target.value)} className="sr-only" />
                                          <div className={cn("w-full h-full rounded-md shadow-inner", color.bg)} />
                                          {field.value === color.id && 
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                  <Check className="h-6 w-6 text-white" />
                                              </div>
                                          }
                                      </label>
                                      ))}
                                  </div>
                                  </FormControl>
                                  <FormMessage className="text-center" />
                              </FormItem>
                              )} />
                          )}
                          {currentStep === 5 && (
                             <div className="flex flex-col items-center justify-center text-center py-8">
                                <PartyPopper className="h-16 w-16 text-primary mb-4" />
                                <h3 className="text-xl font-bold">Parabéns!</h3>
                                <p className="text-muted-foreground">Você está pronta para decolar. Você será redirecionada em instantes.</p>
                             </div>
                          )}
                        </div>
                    </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex w-full items-center justify-between">
                  <Button type="button" variant="ghost" onClick={handleBack} className={cn("transition-opacity", currentStep === 0 || currentStep === steps.length - 1 ? "invisible" : "visible")}>
                    Voltar
                  </Button>
                  
                  {currentStep < steps.length - 2 ? (
                    <Button type="button" onClick={handleNext}>
                      {currentStep === 0 ? "Começar" : "Próximo"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : currentStep === steps.length - 2 ? (
                    <Button type="button" onClick={handleNext} disabled={isSubmitting || !selectedColor}>
                      {isSubmitting ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizando...</>
                      ) : (
                          <>Concluir <Check className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  ) : null}

                </div>

                <div className="w-full mt-4">
                    <Progress value={(currentStep / (steps.length - 1)) * 100} />
                </div>
              </form>
            </Form>
            </div>
        </div>

        {/* --- Painel Direito (Imagem) --- */}
        <div className="relative hidden w-1/2 items-center justify-center overflow-hidden md:flex">
            <AnimatePresence>
                <motion.div
                    key={currentStep}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={imageVariants}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    <Image
                        src={steps[currentStep].image}
                        alt={steps[currentStep].title}
                        fill
                        className="object-cover"
                        priority
                        quality={100}
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

    