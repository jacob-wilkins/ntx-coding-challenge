-- CreateTable
CREATE TABLE "TodoTask" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL DEFAULT 1,
    "title" VARCHAR(255) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TodoTask_pkey" PRIMARY KEY ("id")
);
