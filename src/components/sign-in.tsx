import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { Loader2, SplitSquareHorizontalIcon } from 'lucide-react'
import { useState } from 'react'

export default function SignIn() {
  const [loading, setLoading] = useState(false)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <SplitSquareHorizontalIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl font-bold">
          Bienvenido a <span className="text-primary">Courty</span>
        </CardTitle>
        <CardDescription>
          Inicia sesión para acceder a torneos, reservas y más.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          variant="outline"
          className="w-full h-11 gap-2.5 text-sm font-medium"
          disabled={loading}
          onClick={async () => {
            await authClient.signIn.social({
              provider: 'google',
              callbackURL: '/dashboard',
              fetchOptions: {
                onRequest: () => {
                  setLoading(true)
                },
                onResponse: () => {
                  setLoading(false)
                },
              },
            })
          }}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 256 262"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              />
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              />
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
              />
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              />
            </svg>
          )}
          Continuar con Google
        </Button>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground text-center">
          Al continuar, aceptas nuestros{' '}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Términos
          </a>{' '}
          y{' '}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Política de Privacidad
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  )
}
