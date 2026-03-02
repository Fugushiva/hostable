-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "failed_jobs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"uuid" varchar(255) NOT NULL,
	"connection" text NOT NULL,
	"queue" text NOT NULL,
	"payload" text NOT NULL,
	"exception" text NOT NULL,
	"failed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"queue" varchar(255) NOT NULL,
	"payload" text NOT NULL,
	"attempts" smallint NOT NULL,
	"reserved_at" bigint,
	"available_at" bigint NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "annonces" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"host_id" bigint NOT NULL,
	"country_id" bigint NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"schedule" timestamp with time zone NOT NULL,
	"cuisine" varchar(255) NOT NULL,
	"max_guest" bigint NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"status" "annonces_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "annonces_pictures" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"path" varchar(255) NOT NULL,
	"annonce_id" bigint NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "booking_codes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"reservation_id" bigint NOT NULL,
	"code" varchar(255) NOT NULL,
	"validated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "cache" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"expiration" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cache_locks" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"owner" varchar(255) NOT NULL,
	"expiration" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_batches" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"total_jobs" bigint NOT NULL,
	"pending_jobs" bigint NOT NULL,
	"failed_jobs" bigint NOT NULL,
	"failed_job_ids" text NOT NULL,
	"options" text,
	"cancelled_at" bigint,
	"created_at" bigint NOT NULL,
	"finished_at" bigint
);
--> statement-breakpoint
CREATE TABLE "hosts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"bio" text NOT NULL,
	"birthdate" date NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"profile_picture" varchar(255) DEFAULT NULL,
	"stripe_account_id" varchar(255) DEFAULT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"iso2" varchar(2) NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" smallint DEFAULT '1' NOT NULL,
	"phone_code" varchar(5) NOT NULL,
	"iso3" varchar(3) NOT NULL,
	"region" varchar(255) NOT NULL,
	"subregion" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"country_id" bigint NOT NULL,
	"state_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"country_code" varchar(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "currencies" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"country_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL,
	"precision" smallint DEFAULT '2' NOT NULL,
	"symbol" varchar(255) NOT NULL,
	"symbol_native" varchar(255) NOT NULL,
	"symbol_first" smallint DEFAULT '1' NOT NULL,
	"decimal_mark" varchar(1) DEFAULT '.' NOT NULL,
	"thousands_separator" varchar(1) DEFAULT ',' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"reservation_id" bigint NOT NULL,
	"reviewer_id" bigint NOT NULL,
	"reviewee_id" bigint NOT NULL,
	"rating" bigint NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "exports" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"completed_at" timestamp with time zone,
	"file_disk" varchar(255) NOT NULL,
	"file_name" varchar(255) DEFAULT NULL,
	"exporter" varchar(255) NOT NULL,
	"processed_rows" bigint DEFAULT '0' NOT NULL,
	"total_rows" bigint NOT NULL,
	"successful_rows" bigint DEFAULT '0' NOT NULL,
	"user_id" bigint NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "imports" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"completed_at" timestamp with time zone,
	"file_name" varchar(255) NOT NULL,
	"file_path" varchar(255) NOT NULL,
	"importer" varchar(255) NOT NULL,
	"processed_rows" bigint DEFAULT '0' NOT NULL,
	"total_rows" bigint NOT NULL,
	"successful_rows" bigint DEFAULT '0' NOT NULL,
	"user_id" bigint NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "failed_import_rows" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"data" text NOT NULL,
	"import_id" bigint NOT NULL,
	"validation_error" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "migrations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"migration" varchar(255) NOT NULL,
	"batch" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"thread_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"last_read" timestamp with time zone,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"annonce_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"status" "reservations_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "states" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"country_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"country_code" varchar(3) DEFAULT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"type" varchar(255) NOT NULL,
	"data" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"profile" "profiles_profile" NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "profile_user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"profile_id" bigint NOT NULL,
	"user_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"role" "roles_role" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"role_id" bigint NOT NULL,
	"user_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"ip_address" varchar(45) DEFAULT NULL,
	"user_agent" text,
	"payload" text NOT NULL,
	"last_activity" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" char(2) NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_native" varchar(255) NOT NULL,
	"dir" char(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"subject" varchar(255) NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"thread_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"is_read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified_at" timestamp with time zone DEFAULT '2024-10-03 22:00:00+00' NOT NULL,
	"password" varchar(255) NOT NULL,
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"profile_picture" varchar(255) DEFAULT NULL,
	"remember_token" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"country_id" bigint NOT NULL,
	"city_id" bigint NOT NULL,
	"language_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timezones" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"country_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"reservation_id" bigint NOT NULL,
	"host_id" bigint NOT NULL,
	"quantity" bigint NOT NULL,
	"currency" varchar(3) NOT NULL,
	"payment_status" "transactions_payment_status" NOT NULL,
	"stripe_transaction_id" varchar(255) NOT NULL,
	"commission" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "annonces" ADD CONSTRAINT "fk_annonces_host_id" FOREIGN KEY ("host_id") REFERENCES "public"."hosts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "annonces" ADD CONSTRAINT "fk_annonces_country_id" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "annonces_pictures" ADD CONSTRAINT "fk_annonces_pictures_annonce_id" FOREIGN KEY ("annonce_id") REFERENCES "public"."annonces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_codes" ADD CONSTRAINT "fk_booking_codes_reservation_id" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hosts" ADD CONSTRAINT "fk_hosts_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "fk_cities_country_id" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "fk_cities_state_id" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currencies" ADD CONSTRAINT "fk_currencies_country_id" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "fk_evaluations_reservation_id" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "fk_evaluations_reviewer_id" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "fk_evaluations_reviewee_id" FOREIGN KEY ("reviewee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exports" ADD CONSTRAINT "fk_exports_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imports" ADD CONSTRAINT "fk_imports_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failed_import_rows" ADD CONSTRAINT "fk_failed_import_rows_import_id" FOREIGN KEY ("import_id") REFERENCES "public"."imports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "fk_participants_thread_id" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "fk_participants_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "fk_reservations_annonce_id" FOREIGN KEY ("annonce_id") REFERENCES "public"."annonces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "fk_reservations_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "states" ADD CONSTRAINT "fk_states_country_id" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_user" ADD CONSTRAINT "fk_profile_user_profile_id" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_user" ADD CONSTRAINT "fk_profile_user_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_user" ADD CONSTRAINT "fk_role_user_role_id" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_user" ADD CONSTRAINT "fk_role_user_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "fk_sessions_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_thread_id" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "fk_users_country_id" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "fk_users_city_id" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "fk_users_language_id" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timezones" ADD CONSTRAINT "fk_timezones_country_id" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "fk_transactions_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "fk_transactions_reservation_id" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "fk_transactions_host_id" FOREIGN KEY ("host_id") REFERENCES "public"."hosts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_16509_failed_jobs_uuid_unique" ON "failed_jobs" USING btree ("uuid" text_ops);--> statement-breakpoint
CREATE INDEX "idx_16535_jobs_queue_index" ON "jobs" USING btree ("queue" text_ops);--> statement-breakpoint
CREATE INDEX "idx_16426_annonces_country_id_foreign" ON "annonces" USING btree ("country_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16426_annonces_host_id_foreign" ON "annonces" USING btree ("host_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16434_annonces_pictures_annonce_id_foreign" ON "annonces_pictures" USING btree ("annonce_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16441_booking_codes_reservation_id_foreign" ON "booking_codes" USING btree ("reservation_id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_16517_hosts_user_id_unique" ON "hosts" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16485_evaluations_reservation_id_foreign" ON "evaluations" USING btree ("reservation_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16485_evaluations_reviewee_id_foreign" ON "evaluations" USING btree ("reviewee_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16485_evaluations_reviewer_id_foreign" ON "evaluations" USING btree ("reviewer_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16492_exports_user_id_foreign" ON "exports" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16526_imports_user_id_foreign" ON "imports" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16502_failed_import_rows_import_id_foreign" ON "failed_import_rows" USING btree ("import_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16596_reservations_annonce_id_foreign" ON "reservations" USING btree ("annonce_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16596_reservations_user_id_foreign" ON "reservations" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16567_notifications_user_id_foreign" ON "notifications" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16589_profile_user_profile_id_foreign" ON "profile_user" USING btree ("profile_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16589_profile_user_user_id_foreign" ON "profile_user" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16609_role_user_role_id_foreign" ON "role_user" USING btree ("role_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16609_role_user_user_id_foreign" ON "role_user" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16615_sessions_last_activity_index" ON "sessions" USING btree ("last_activity" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16615_sessions_user_id_index" ON "sessions" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16649_users_city_id_foreign" ON "users" USING btree ("city_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16649_users_country_id_foreign" ON "users" USING btree ("country_id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_16649_users_email_unique" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "idx_16649_users_language_id_foreign" ON "users" USING btree ("language_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16642_transactions_host_id_foreign" ON "transactions" USING btree ("host_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16642_transactions_reservation_id_foreign" ON "transactions" USING btree ("reservation_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_16642_transactions_user_id_foreign" ON "transactions" USING btree ("user_id" int8_ops);
*/