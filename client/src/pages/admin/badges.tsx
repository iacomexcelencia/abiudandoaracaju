import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Medal, Star } from "lucide-react";

interface BadgeItem {
  id: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  icon: string;
  category: string;
  rarity: string;
  points: string;
  requirement: any;
  isActive: boolean | null;
}

export default function AdminBadges() {
  const { data: badges = [], isLoading } = useQuery<BadgeItem[]>({
    queryKey: ["/api/badges"],
  });

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      bronze: "bg-amber-100 text-amber-800 border-amber-300",
      silver: "bg-gray-100 text-gray-800 border-gray-300",
      gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
      legendary: "bg-purple-100 text-purple-800 border-purple-300"
    };
    return colors[rarity] || "bg-gray-100 text-gray-800";
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return <Star className="h-5 w-5 text-purple-600" />;
      case "gold":
        return <Trophy className="h-5 w-5 text-yellow-600" />;
      case "silver":
        return <Medal className="h-5 w-5 text-gray-600" />;
      default:
        return <Award className="h-5 w-5 text-amber-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      praia: "bg-blue-50 text-blue-700",
      historico: "bg-amber-50 text-amber-700",
      cultura: "bg-purple-50 text-purple-700",
      especial: "bg-green-50 text-green-700"
    };
    return colors[category] || "bg-gray-50 text-gray-700";
  };

  const stats = {
    total: badges.length,
    bronze: badges.filter(b => b.rarity === "bronze").length,
    silver: badges.filter(b => b.rarity === "silver").length,
    gold: badges.filter(b => b.rarity === "gold").length,
    legendary: badges.filter(b => b.rarity === "legendary").length
  };

  return (
    <AdminLayout title="Badges e Conquistas" subtitle="Gerencie as conquistas e badges do sistema de gamificação">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Bronze</CardTitle>
              <Award className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">{stats.bronze}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Prata</CardTitle>
              <Medal className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700">{stats.silver}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ouro</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{stats.gold}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lendário</CardTitle>
              <Star className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{stats.legendary}</div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Carregando badges...</div>
          ) : badges.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">Nenhum badge cadastrado</div>
          ) : (
            badges.map((badge) => (
              <Card key={badge.id} className="hover:shadow-lg transition-shadow" data-testid={`card-badge-${badge.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getRarityIcon(badge.rarity)}
                      <div>
                        <CardTitle className="text-lg">{badge.name_pt}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getRarityColor(badge.rarity)} variant="outline">
                            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                          </Badge>
                          <Badge className={getCategoryColor(badge.category)} variant="outline">
                            {badge.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-3">
                    {badge.description_pt}
                  </CardDescription>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-semibold text-yellow-700">{badge.points} pontos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {badge.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Inativo
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Requirement Info */}
                  {badge.requirement && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-medium mb-1">Requisito:</p>
                      <p className="text-xs text-gray-700">
                        {JSON.stringify(badge.requirement, null, 2)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
