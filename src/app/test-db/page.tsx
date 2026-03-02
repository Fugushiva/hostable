import { db } from "@/db";
import { users, annonces } from "@/db/schema";
import { count } from "drizzle-orm";

export default async function TestDbPage() {
    // On récupère quelques données depuis la base Neon via Drizzle
    const allUsersCount = await db.select({ value: count() }).from(users);
    const allAnnoncesCount = await db.select({ value: count() }).from(annonces);

    // On récupère les 5 derniers utilisateurs
    const latestUsers = await db.select().from(users).limit(5);

    return (
        <div className="p-8 max-w-4xl mx-auto font-sans">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Connexion Neon + Drizzle Réussie ! 🎉</h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700">Utilisateurs totaux</h2>
                    <p className="text-4xl font-bold text-blue-500 mt-2">{allUsersCount[0].value}</p>
                </div>
                <div className="p-6 bg-white shadow rounded-lg border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700">Annonces totales</h2>
                    <p className="text-4xl font-bold text-blue-500 mt-2">{allAnnoncesCount[0].value}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">5 derniers utilisateurs</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Prénom Nom</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {latestUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-500">{user.id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.firstname} {user.lastname}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                            </tr>
                        ))}
                        {latestUsers.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Aucun utilisateur trouvé.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
