-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pickId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "relisten" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reviews_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk1" FOREIGN KEY ("pickId") REFERENCES "picks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
