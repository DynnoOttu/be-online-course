-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('VIDEO', 'ARTICLE');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "topics" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(255) NOT NULL,
    "total_courses" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "about" TEXT,
    "tools" TEXT,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "total_lessons" INTEGER NOT NULL DEFAULT 0,
    "total_students" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_image" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "image_path" VARCHAR(500) NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_key_points" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "key_point" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "course_key_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_personas" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "persona" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "course_personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_resources" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "resource_type" VARCHAR(50) NOT NULL,
    "resource_path" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "course_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coruse_sections" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL,
    "total_lessons" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "coruse_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content_type" "ContentType" NOT NULL,
    "content_url" VARCHAR(500),
    "content_text" TEXT,
    "duration_minutes" INTEGER NOT NULL DEFAULT 0,
    "order_index" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "progress_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "enrolled_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ,
    "certificate_id" VARCHAR(255),

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progress" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "ppn_amount" DECIMAL(10,2) NOT NULL,
    "ppn_rate" DECIMAL(5,4) NOT NULL,
    "platform_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "platform_fee_rate" DECIMAL(5,4) NOT NULL,
    "mentor_net_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" VARCHAR(50),
    "order_id" VARCHAR(255) NOT NULL,
    "snap_token" VARCHAR(500),
    "snap_redirect_url" VARCHAR(1000),
    "gross_amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'IDR',
    "transaction_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMPTZ,
    "expired_at" TIMESTAMPTZ,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_notifications" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "order_id" VARCHAR(255) NOT NULL,
    "transaction_status" VARCHAR(50) NOT NULL,
    "midtrans_transaction_id" VARCHAR(255),
    "status_code" VARCHAR(10),
    "gross_amount" DECIMAL(10,2),
    "payment_type" VARCHAR(50),
    "transaction_time" TIMESTAMPTZ,
    "settlement_time" TIMESTAMPTZ,
    "fraud_status" VARCHAR(50),
    "signature_key" VARCHAR(500),
    "raw_notification" JSONB NOT NULL,
    "is_processed" BOOLEAN NOT NULL DEFAULT false,
    "processed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_reviews" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "rating" SMALLINT NOT NULL,
    "review_text" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "withdrawal_code" VARCHAR(50) NOT NULL,
    "bank_name" VARCHAR(100) NOT NULL,
    "account_number" VARCHAR(50) NOT NULL,
    "account_holder_name" VARCHAR(255) NOT NULL,
    "processed_by" INTEGER,
    "proof_payment_withrawl" VARCHAR(255),
    "requested_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "courses_subject_id_idx" ON "courses"("subject_id");

-- CreateIndex
CREATE INDEX "courses_mentor_id_idx" ON "courses"("mentor_id");

-- CreateIndex
CREATE INDEX "courses_status_idx" ON "courses"("status");

-- CreateIndex
CREATE INDEX "course_image_course_id_idx" ON "course_image"("course_id");

-- CreateIndex
CREATE INDEX "course_key_points_course_id_idx" ON "course_key_points"("course_id");

-- CreateIndex
CREATE INDEX "course_personas_course_id_idx" ON "course_personas"("course_id");

-- CreateIndex
CREATE INDEX "course_resources_course_id_idx" ON "course_resources"("course_id");

-- CreateIndex
CREATE INDEX "lessons_section_id_idx" ON "lessons"("section_id");

-- CreateIndex
CREATE INDEX "lessons_content_type_idx" ON "lessons"("content_type");

-- CreateIndex
CREATE INDEX "enrollments_student_id_idx" ON "enrollments"("student_id");

-- CreateIndex
CREATE INDEX "enrollments_course_id_idx" ON "enrollments"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_student_id_course_id_key" ON "enrollments"("student_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_student_id_lesson_id_key" ON "lesson_progress"("student_id", "lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_student_id_key" ON "lesson_progress"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_lesson_id_key" ON "lesson_progress"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_order_id_key" ON "transactions"("order_id");

-- CreateIndex
CREATE INDEX "transactions_student_id_idx" ON "transactions"("student_id");

-- CreateIndex
CREATE INDEX "transactions_course_id_idx" ON "transactions"("course_id");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_order_id_idx" ON "transactions"("order_id");

-- CreateIndex
CREATE INDEX "payment_notifications_order_id_idx" ON "payment_notifications"("order_id");

-- CreateIndex
CREATE INDEX "payment_notifications_transaction_status_idx" ON "payment_notifications"("transaction_status");

-- CreateIndex
CREATE INDEX "payment_notifications_is_processed_idx" ON "payment_notifications"("is_processed");

-- CreateIndex
CREATE INDEX "course_reviews_course_id_idx" ON "course_reviews"("course_id");

-- CreateIndex
CREATE INDEX "course_reviews_rating_idx" ON "course_reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "course_reviews_student_id_course_id_key" ON "course_reviews"("student_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "withdrawals_withdrawal_code_key" ON "withdrawals"("withdrawal_code");

-- CreateIndex
CREATE INDEX "withdrawals_user_id_idx" ON "withdrawals"("user_id");

-- CreateIndex
CREATE INDEX "withdrawals_status_idx" ON "withdrawals"("status");

-- CreateIndex
CREATE INDEX "withdrawals_processed_by_idx" ON "withdrawals"("processed_by");

-- CreateIndex
CREATE INDEX "withdrawals_requested_at_idx" ON "withdrawals"("requested_at");

-- CreateIndex
CREATE INDEX "withdrawals_account_number_idx" ON "withdrawals"("account_number");

-- CreateIndex
CREATE INDEX "withdrawals_withdrawal_code_idx" ON "withdrawals"("withdrawal_code");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_image" ADD CONSTRAINT "course_image_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_key_points" ADD CONSTRAINT "course_key_points_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_personas" ADD CONSTRAINT "course_personas_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_resources" ADD CONSTRAINT "course_resources_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coruse_sections" ADD CONSTRAINT "coruse_sections_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "coruse_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_notifications" ADD CONSTRAINT "payment_notifications_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
