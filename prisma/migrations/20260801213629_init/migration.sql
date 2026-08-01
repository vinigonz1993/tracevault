-- CreateTable
CREATE TABLE "change_logs" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "previousState" JSONB,
    "currentState" JSONB NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "change_logs_objectType_objectId_idx" ON "change_logs"("objectType", "objectId");

-- CreateIndex
CREATE INDEX "change_logs_userId_idx" ON "change_logs"("userId");
