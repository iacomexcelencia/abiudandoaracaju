import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <AdminLayout title="Configurações" subtitle="Configurações do sistema">
      <div className="grid gap-6">
        <Card data-testid="general-settings">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Sistema</label>
                <input 
                  type="text" 
                  value="ABIUDANDO AJU" 
                  className="w-full p-2 border rounded-md"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea 
                  value="Sistema de turismo da Prefeitura de Aracaju"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  readOnly
                />
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="system-info">
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Versão:</p>
                <p className="text-gray-600">1.0.0</p>
              </div>
              <div>
                <p className="font-semibold">Última Atualização:</p>
                <p className="text-gray-600">11/09/2025</p>
              </div>
              <div>
                <p className="font-semibold">Desenvolvido por:</p>
                <p className="text-gray-600">Secretaria de Turismo</p>
              </div>
              <div>
                <p className="font-semibold">Prefeitura:</p>
                <p className="text-gray-600">Aracaju - SE</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}