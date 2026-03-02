import { pgTable, uniqueIndex, bigserial, varchar, text, timestamp, index, smallint, bigint, foreignKey, numeric, boolean, date, char } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const failedJobs = pgTable("failed_jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: varchar({ length: 255 }).notNull(),
	connection: text().notNull(),
	queue: text().notNull(),
	payload: text().notNull(),
	exception: text().notNull(),
	failedAt: timestamp("failed_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("idx_16509_failed_jobs_uuid_unique").using("btree", table.uuid.asc().nullsLast().op("text_ops")),
]);

export const jobs = pgTable("jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	queue: varchar({ length: 255 }).notNull(),
	payload: text().notNull(),
	attempts: smallint().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	reservedAt: bigint("reserved_at", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	availableAt: bigint("available_at", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }).notNull(),
}, (table) => [
	index("idx_16535_jobs_queue_index").using("btree", table.queue.asc().nullsLast().op("text_ops")),
]);

export const annonces = pgTable("annonces", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	hostId: bigint("host_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	countryId: bigint("country_id", { mode: "number" }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	schedule: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	cuisine: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	maxGuest: bigint("max_guest", { mode: "number" }).notNull(),
	price: numeric({ precision: 10, scale: 2 }).notNull(),
	// TODO: failed to parse database type 'annonces_status'
	status: text("status").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16426_annonces_country_id_foreign").using("btree", table.countryId.asc().nullsLast().op("int8_ops")),
	index("idx_16426_annonces_host_id_foreign").using("btree", table.hostId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.hostId],
		foreignColumns: [hosts.id],
		name: "fk_annonces_host_id"
	}),
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [countries.id],
		name: "fk_annonces_country_id"
	}),
]);

export const annoncesPictures = pgTable("annonces_pictures", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	path: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	annonceId: bigint("annonce_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16434_annonces_pictures_annonce_id_foreign").using("btree", table.annonceId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.annonceId],
		foreignColumns: [annonces.id],
		name: "fk_annonces_pictures_annonce_id"
	}),
]);

export const bookingCodes = pgTable("booking_codes", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	reservationId: bigint("reservation_id", { mode: "number" }).notNull(),
	code: varchar({ length: 255 }).notNull(),
	validated: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16441_booking_codes_reservation_id_foreign").using("btree", table.reservationId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.reservationId],
		foreignColumns: [reservations.id],
		name: "fk_booking_codes_reservation_id"
	}),
]);

export const cache = pgTable("cache", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	value: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiration: bigint({ mode: "number" }).notNull(),
});

export const cacheLocks = pgTable("cache_locks", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	owner: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiration: bigint({ mode: "number" }).notNull(),
});

export const jobBatches = pgTable("job_batches", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalJobs: bigint("total_jobs", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pendingJobs: bigint("pending_jobs", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	failedJobs: bigint("failed_jobs", { mode: "number" }).notNull(),
	failedJobIds: text("failed_job_ids").notNull(),
	options: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cancelledAt: bigint("cancelled_at", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	finishedAt: bigint("finished_at", { mode: "number" }),
});

export const hosts = pgTable("hosts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	bio: text().notNull(),
	birthdate: date().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	profilePicture: varchar("profile_picture", { length: 255 }).default(sql`NULL`),
	stripeAccountId: varchar("stripe_account_id", { length: 255 }).default(sql`NULL`),
}, (table) => [
	uniqueIndex("idx_16517_hosts_user_id_unique").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_hosts_user_id"
	}),
]);

export const countries = pgTable("countries", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	iso2: varchar({ length: 2 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	status: smallint().default(sql`'1'`).notNull(),
	phoneCode: varchar("phone_code", { length: 5 }).notNull(),
	iso3: varchar({ length: 3 }).notNull(),
	region: varchar({ length: 255 }).notNull(),
	subregion: varchar({ length: 255 }).notNull(),
});

export const cities = pgTable("cities", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	countryId: bigint("country_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stateId: bigint("state_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	countryCode: varchar("country_code", { length: 3 }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [countries.id],
		name: "fk_cities_country_id"
	}),
	foreignKey({
		columns: [table.stateId],
		foreignColumns: [states.id],
		name: "fk_cities_state_id"
	}),
]);

export const currencies = pgTable("currencies", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	countryId: bigint("country_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	code: varchar({ length: 255 }).notNull(),
	precision: smallint().default(sql`'2'`).notNull(),
	symbol: varchar({ length: 255 }).notNull(),
	symbolNative: varchar("symbol_native", { length: 255 }).notNull(),
	symbolFirst: smallint("symbol_first").default(sql`'1'`).notNull(),
	decimalMark: varchar("decimal_mark", { length: 1 }).default('.').notNull(),
	thousandsSeparator: varchar("thousands_separator", { length: 1 }).default(',').notNull(),
}, (table) => [
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [countries.id],
		name: "fk_currencies_country_id"
	}),
]);

export const evaluations = pgTable("evaluations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	reservationId: bigint("reservation_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	reviewerId: bigint("reviewer_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	revieweeId: bigint("reviewee_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	rating: bigint({ mode: "number" }).notNull(),
	comment: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16485_evaluations_reservation_id_foreign").using("btree", table.reservationId.asc().nullsLast().op("int8_ops")),
	index("idx_16485_evaluations_reviewee_id_foreign").using("btree", table.revieweeId.asc().nullsLast().op("int8_ops")),
	index("idx_16485_evaluations_reviewer_id_foreign").using("btree", table.reviewerId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.reservationId],
		foreignColumns: [reservations.id],
		name: "fk_evaluations_reservation_id"
	}),
	foreignKey({
		columns: [table.reviewerId],
		foreignColumns: [users.id],
		name: "fk_evaluations_reviewer_id"
	}),
	foreignKey({
		columns: [table.revieweeId],
		foreignColumns: [users.id],
		name: "fk_evaluations_reviewee_id"
	}),
]);

export const exportsTable = pgTable("exports", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	fileDisk: varchar("file_disk", { length: 255 }).notNull(),
	fileName: varchar("file_name", { length: 255 }).default(sql`NULL`),
	exporter: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	processedRows: bigint("processed_rows", { mode: "number" }).default(sql`'0'`).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalRows: bigint("total_rows", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	successfulRows: bigint("successful_rows", { mode: "number" }).default(sql`'0'`).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16492_exports_user_id_foreign").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_exports_user_id"
	}),
]);

export const imports = pgTable("imports", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	filePath: varchar("file_path", { length: 255 }).notNull(),
	importer: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	processedRows: bigint("processed_rows", { mode: "number" }).default(sql`'0'`).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalRows: bigint("total_rows", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	successfulRows: bigint("successful_rows", { mode: "number" }).default(sql`'0'`).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16526_imports_user_id_foreign").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_imports_user_id"
	}),
]);

export const failedImportRows = pgTable("failed_import_rows", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	data: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	importId: bigint("import_id", { mode: "number" }).notNull(),
	validationError: text("validation_error"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16502_failed_import_rows_import_id_foreign").using("btree", table.importId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.importId],
		foreignColumns: [imports.id],
		name: "fk_failed_import_rows_import_id"
	}),
]);

export const migrations = pgTable("migrations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	migration: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	batch: bigint({ mode: "number" }).notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
	email: varchar({ length: 255 }).primaryKey().notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
});

export const participants = pgTable("participants", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	threadId: bigint("thread_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	lastRead: timestamp("last_read", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.threadId],
		foreignColumns: [threads.id],
		name: "fk_participants_thread_id"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_participants_user_id"
	}),
]);

export const reservations = pgTable("reservations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	annonceId: bigint("annonce_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	// TODO: failed to parse database type 'reservations_status'
	status: text("status").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16596_reservations_annonce_id_foreign").using("btree", table.annonceId.asc().nullsLast().op("int8_ops")),
	index("idx_16596_reservations_user_id_foreign").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.annonceId],
		foreignColumns: [annonces.id],
		name: "fk_reservations_annonce_id"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_reservations_user_id"
	}),
]);

export const states = pgTable("states", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	countryId: bigint("country_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	countryCode: varchar("country_code", { length: 3 }).default(sql`NULL`),
}, (table) => [
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [countries.id],
		name: "fk_states_country_id"
	}),
]);

export const notifications = pgTable("notifications", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	data: text().notNull(),
	readAt: timestamp("read_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16567_notifications_user_id_foreign").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_notifications_user_id"
	}),
]);

export const profiles = pgTable("profiles", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// TODO: failed to parse database type 'profiles_profile'
	profile: text("profile").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const profileUser = pgTable("profile_user", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	profileId: bigint("profile_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
}, (table) => [
	index("idx_16589_profile_user_profile_id_foreign").using("btree", table.profileId.asc().nullsLast().op("int8_ops")),
	index("idx_16589_profile_user_user_id_foreign").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.profileId],
		foreignColumns: [profiles.id],
		name: "fk_profile_user_profile_id"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_profile_user_user_id"
	}),
]);

export const roles = pgTable("roles", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// TODO: failed to parse database type 'roles_role'
	role: text("role").notNull(),
});

export const roleUser = pgTable("role_user", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roleId: bigint("role_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
}, (table) => [
	index("idx_16609_role_user_role_id_foreign").using("btree", table.roleId.asc().nullsLast().op("int8_ops")),
	index("idx_16609_role_user_user_id_foreign").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.roleId],
		foreignColumns: [roles.id],
		name: "fk_role_user_role_id"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_role_user_user_id"
	}),
]);

export const sessions = pgTable("sessions", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	ipAddress: varchar("ip_address", { length: 45 }).default(sql`NULL`),
	userAgent: text("user_agent"),
	payload: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	lastActivity: bigint("last_activity", { mode: "number" }).notNull(),
}, (table) => [
	index("idx_16615_sessions_last_activity_index").using("btree", table.lastActivity.asc().nullsLast().op("int8_ops")),
	index("idx_16615_sessions_user_id_index").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_sessions_user_id"
	}),
]);

export const languages = pgTable("languages", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	code: char({ length: 2 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	nameNative: varchar("name_native", { length: 255 }).notNull(),
	dir: char({ length: 3 }).notNull(),
});

export const threads = pgTable("threads", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	subject: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});

export const messages = pgTable("messages", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	threadId: bigint("thread_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	body: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	isRead: boolean("is_read").default(false).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.threadId],
		foreignColumns: [threads.id],
		name: "fk_messages_thread_id"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_messages_user_id"
	}),
]);

export const users = pgTable("users", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true, mode: 'string' }).default('2024-10-03 22:00:00+00').notNull(),
	password: varchar({ length: 255 }).notNull(),
	firstname: varchar({ length: 255 }).notNull(),
	lastname: varchar({ length: 255 }).notNull(),
	profilePicture: varchar("profile_picture", { length: 255 }).default(sql`NULL`),
	rememberToken: varchar("remember_token", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	countryId: bigint("country_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cityId: bigint("city_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	languageId: bigint("language_id", { mode: "number" }).notNull(),
}, (table) => [
	index("idx_16649_users_city_id_foreign").using("btree", table.cityId.asc().nullsLast().op("int8_ops")),
	index("idx_16649_users_country_id_foreign").using("btree", table.countryId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("idx_16649_users_email_unique").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_16649_users_language_id_foreign").using("btree", table.languageId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [countries.id],
		name: "fk_users_country_id"
	}),
	foreignKey({
		columns: [table.cityId],
		foreignColumns: [cities.id],
		name: "fk_users_city_id"
	}),
	foreignKey({
		columns: [table.languageId],
		foreignColumns: [languages.id],
		name: "fk_users_language_id"
	}),
]);

export const timezones = pgTable("timezones", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	countryId: bigint("country_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [countries.id],
		name: "fk_timezones_country_id"
	}),
]);

export const transactions = pgTable("transactions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	reservationId: bigint("reservation_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	hostId: bigint("host_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	quantity: bigint({ mode: "number" }).notNull(),
	currency: varchar({ length: 3 }).notNull(),
	// TODO: failed to parse database type 'transactions_payment_status'
	paymentStatus: text("payment_status").notNull(),
	stripeTransactionId: varchar("stripe_transaction_id", { length: 255 }).notNull(),
	commission: numeric({ precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_16642_transactions_host_id_foreign").using("btree", table.hostId.asc().nullsLast().op("int8_ops")),
	index("idx_16642_transactions_reservation_id_foreign").using("btree", table.reservationId.asc().nullsLast().op("int8_ops")),
	index("idx_16642_transactions_user_id_foreign").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "fk_transactions_user_id"
	}),
	foreignKey({
		columns: [table.reservationId],
		foreignColumns: [reservations.id],
		name: "fk_transactions_reservation_id"
	}),
	foreignKey({
		columns: [table.hostId],
		foreignColumns: [hosts.id],
		name: "fk_transactions_host_id"
	}),
]);
