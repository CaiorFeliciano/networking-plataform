import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <div className="min-h-screen bg-gradient from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Candidatura Enviada!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sua candidatura foi recebida com sucesso. Nossa equipe entrará em
              contato em breve.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {searchParams.id && (
              <p className="text-sm text-gray-500">
                ID da sua candidatura:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {searchParams.id}
                </code>
              </p>
            )}

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">Voltar para Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
