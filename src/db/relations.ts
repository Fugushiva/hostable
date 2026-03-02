import { relations } from "drizzle-orm/relations";
import { hosts, annonces, countries, annoncesPictures, reservations, bookingCodes, users, cities, states, currencies, evaluations, exportsTable, imports, failedImportRows, threads, participants, notifications, profiles, profileUser, roles, roleUser, sessions, messages, languages, timezones, transactions } from "./schema";

export const annoncesRelations = relations(annonces, ({ one, many }) => ({
	host: one(hosts, {
		fields: [annonces.hostId],
		references: [hosts.id]
	}),
	country: one(countries, {
		fields: [annonces.countryId],
		references: [countries.id]
	}),
	annoncesPictures: many(annoncesPictures),
	reservations: many(reservations),
}));

export const hostsRelations = relations(hosts, ({ one, many }) => ({
	annonces: many(annonces),
	user: one(users, {
		fields: [hosts.userId],
		references: [users.id]
	}),
	transactions: many(transactions),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
	annonces: many(annonces),
	cities: many(cities),
	currencies: many(currencies),
	states: many(states),
	users: many(users),
	timezones: many(timezones),
}));

export const annoncesPicturesRelations = relations(annoncesPictures, ({ one }) => ({
	annonce: one(annonces, {
		fields: [annoncesPictures.annonceId],
		references: [annonces.id]
	}),
}));

export const bookingCodesRelations = relations(bookingCodes, ({ one }) => ({
	reservation: one(reservations, {
		fields: [bookingCodes.reservationId],
		references: [reservations.id]
	}),
}));

export const reservationsRelations = relations(reservations, ({ one, many }) => ({
	bookingCodes: many(bookingCodes),
	evaluations: many(evaluations),
	annonce: one(annonces, {
		fields: [reservations.annonceId],
		references: [annonces.id]
	}),
	user: one(users, {
		fields: [reservations.userId],
		references: [users.id]
	}),
	transactions: many(transactions),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
	hosts: many(hosts),
	evaluations_reviewerId: many(evaluations, {
		relationName: "evaluations_reviewerId_users_id"
	}),
	evaluations_revieweeId: many(evaluations, {
		relationName: "evaluations_revieweeId_users_id"
	}),
	exports: many(exportsTable),
	imports: many(imports),
	participants: many(participants),
	reservations: many(reservations),
	notifications: many(notifications),
	profileUsers: many(profileUser),
	roleUsers: many(roleUser),
	sessions: many(sessions),
	messages: many(messages),
	country: one(countries, {
		fields: [users.countryId],
		references: [countries.id]
	}),
	city: one(cities, {
		fields: [users.cityId],
		references: [cities.id]
	}),
	language: one(languages, {
		fields: [users.languageId],
		references: [languages.id]
	}),
	transactions: many(transactions),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
	country: one(countries, {
		fields: [cities.countryId],
		references: [countries.id]
	}),
	state: one(states, {
		fields: [cities.stateId],
		references: [states.id]
	}),
	users: many(users),
}));

export const statesRelations = relations(states, ({ one, many }) => ({
	cities: many(cities),
	country: one(countries, {
		fields: [states.countryId],
		references: [countries.id]
	}),
}));

export const currenciesRelations = relations(currencies, ({ one }) => ({
	country: one(countries, {
		fields: [currencies.countryId],
		references: [countries.id]
	}),
}));

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
	reservation: one(reservations, {
		fields: [evaluations.reservationId],
		references: [reservations.id]
	}),
	user_reviewerId: one(users, {
		fields: [evaluations.reviewerId],
		references: [users.id],
		relationName: "evaluations_reviewerId_users_id"
	}),
	user_revieweeId: one(users, {
		fields: [evaluations.revieweeId],
		references: [users.id],
		relationName: "evaluations_revieweeId_users_id"
	}),
}));

export const exportsRelations = relations(exportsTable, ({ one }) => ({
	user: one(users, {
		fields: [exportsTable.userId],
		references: [users.id]
	}),
}));

export const importsRelations = relations(imports, ({ one, many }) => ({
	user: one(users, {
		fields: [imports.userId],
		references: [users.id]
	}),
	failedImportRows: many(failedImportRows),
}));

export const failedImportRowsRelations = relations(failedImportRows, ({ one }) => ({
	import: one(imports, {
		fields: [failedImportRows.importId],
		references: [imports.id]
	}),
}));

export const participantsRelations = relations(participants, ({ one }) => ({
	thread: one(threads, {
		fields: [participants.threadId],
		references: [threads.id]
	}),
	user: one(users, {
		fields: [participants.userId],
		references: [users.id]
	}),
}));

export const threadsRelations = relations(threads, ({ many }) => ({
	participants: many(participants),
	messages: many(messages),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));

export const profileUserRelations = relations(profileUser, ({ one }) => ({
	profile: one(profiles, {
		fields: [profileUser.profileId],
		references: [profiles.id]
	}),
	user: one(users, {
		fields: [profileUser.userId],
		references: [users.id]
	}),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
	profileUsers: many(profileUser),
}));

export const roleUserRelations = relations(roleUser, ({ one }) => ({
	role: one(roles, {
		fields: [roleUser.roleId],
		references: [roles.id]
	}),
	user: one(users, {
		fields: [roleUser.userId],
		references: [users.id]
	}),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
	roleUsers: many(roleUser),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	thread: one(threads, {
		fields: [messages.threadId],
		references: [threads.id]
	}),
	user: one(users, {
		fields: [messages.userId],
		references: [users.id]
	}),
}));

export const languagesRelations = relations(languages, ({ many }) => ({
	users: many(users),
}));

export const timezonesRelations = relations(timezones, ({ one }) => ({
	country: one(countries, {
		fields: [timezones.countryId],
		references: [countries.id]
	}),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id]
	}),
	reservation: one(reservations, {
		fields: [transactions.reservationId],
		references: [reservations.id]
	}),
	host: one(hosts, {
		fields: [transactions.hostId],
		references: [hosts.id]
	}),
}));