-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_userId_key" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
