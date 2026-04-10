'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { InfoIcon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitTournament } from '@/lib/actions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import QuickAssistant from './tournament/quick-assistant';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(3000, 'Description must be 3000 characters or less')
    .optional(),
  maxPlayers: z
    .number()
    .int()
    .min(3, 'Maximum must be at least 3 players')
    .max(1000, 'Maximum 1000 players')
    .optional(),
  isPrivate: z.boolean().optional(),
  format: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TournamentFormModalProps {
  user: { id: string } | null;
}

export default function TournamentFormModal({
  user,
}: TournamentFormModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      maxPlayers: undefined,
      isPrivate: false,
      format: 'single_elimination',
    },
  });

  const fillDemoValues = (isPrivate: boolean) => {
    form.setValue(
      'name',
      isPrivate ? 'Cyber Clash Private Arena' : 'Neon Sports Open Cup'
    );
    form.setValue(
      'description',
      isPrivate
        ? 'Invite-only showdown. Approved players compete for leaderboard glory.'
        : 'Public bracket tournament for quick matchmaking and live progression.'
    );
    form.setValue('maxPlayers', isPrivate ? 8 : 16);
    form.setValue('isPrivate', isPrivate);
  };

  const onSubmit = async (data: FormValues) => {
    setIsCreating(true);
    const startMs = Date.now();
    const minAnimationMs = 1500;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await submitTournament(formData);
    const elapsed = Date.now() - startMs;
    if (elapsed < minAnimationMs) {
      await new Promise((resolve) =>
        window.setTimeout(resolve, minAnimationMs - elapsed)
      );
    }

    if (response?.success && response.tournamentId) {
      setOpen(false);
      router.push(`/tournaments/${response.tournamentId}`);
      toast({
        title: 'Tournament Created',
        description: 'New tournament has been created successfully',
      });
    }
    if (response?.error || (response?.success && !response.tournamentId)) {
      toast({
        title: 'Error',
        description:
          response?.error ||
          'Tournament created but ID was not returned. Please refresh and try again.',
      });
    }
    form.reset();
    setIsCreating(false);
  };

  return (
    <>
      {user && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="cyber-btn">
              <Zap className="h-4 w-4 mr-2" /> Create Tournament ⚡
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px] cyber-card">
            <DialogHeader>
              <DialogTitle className="neon-title">Create Tournament 🏆</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new tournament. Lock in your arena.
              </DialogDescription>
            </DialogHeader>

            <div className="mb-2">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full font-mono text-[10px] uppercase tracking-[0.2em] border-y border-cyan-500/10 hover:bg-cyan-500/5 transition-all ${showAssistant ? 'text-cyan-400' : 'text-cyan-900'}`}
                onClick={() => setShowAssistant(!showAssistant)}
              >
                {showAssistant ? '<< SWITCH_TO_MANUAL_ENTRY' : '✨ MAGIC_AI_SETUP_ENABLED >>'}
              </Button>
            </div>

            <AnimatePresence>
              {showAssistant && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <QuickAssistant
                    onApply={(config) => {
                      form.setValue('name', config.name);
                      form.setValue('description', config.description);
                      form.setValue('maxPlayers', config.maxPlayers);
                      form.setValue('isPrivate', config.isPrivate);
                      setShowAssistant(false);
                      toast({
                        title: 'Configuration Applied',
                        description: 'Your setup has been synced with the form.',
                      });
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {isCreating && (
                  <div className="journey-track slide-in-live border-cyan-400/60 shadow-[0_0_14px_rgba(0,240,255,0.35)]">
                    <div className="journey-track-line" />
                    <div className="journey-token" />
                    <div className="relative z-10 grid grid-cols-4 gap-1 text-[10px]">
                      <p className="text-center text-cyan-200 font-semibold">
                        Draft
                      </p>
                      <p className="text-center text-cyan-200 font-semibold">
                        Validate
                      </p>
                      <p className="text-center text-cyan-200 font-semibold">
                        Build
                      </p>
                      <p className="text-center text-cyan-200 font-semibold">
                        Launch
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 rounded border border-cyan-400/30 bg-cyan-500/5 p-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cyber-btn text-xs"
                    onClick={() => fillDemoValues(false)}
                  >
                    🎯 Use Demo Public Data
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cyber-btn text-xs"
                    onClick={() => fillDemoValues(true)}
                  >
                    🔒 Use Demo Private Data
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name{' '}
                        <span className="text-xs align-super text-destructive">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description 📝</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Format 🏆</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full bg-black border border-cyan-500/30 rounded-md p-2 text-cyan-50 focus:border-cyan-400 outline-none"
                        >
                          <option value="single_elimination">Single Elimination</option>
                          <option value="double_elimination">Double Elimination</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPlayers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Players 👥</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <div className="flex items-center space-x-2">
                          <FormLabel>Make private 🔒</FormLabel>
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="w-[400px]">
                                <p>
                                  Private tournaments can only be found by
                                  direct link.
                                </p>
                                <p>
                                  Accessible only to players who have been
                                  approved to join by the creator (you).
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="cyber-btn" disabled={isCreating}>
                    {isCreating ? 'Creating Tournament... ⚡' : 'Create 🚀'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
