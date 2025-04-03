-- DropForeignKey
ALTER TABLE "picks" DROP CONSTRAINT "picks_fk0";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_fk0";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "sessions_fk0";

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picks" ADD CONSTRAINT "picks_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
