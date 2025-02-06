-- CreateTable
CREATE TABLE "picks" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "link" VARCHAR,

    CONSTRAINT "picks_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "picks" ADD CONSTRAINT "picks_fk0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
