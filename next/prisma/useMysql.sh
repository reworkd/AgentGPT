#!/bin/bash
cd "$(dirname "$0")" || exit 1

rm schema.prisma
mv schema.prisma.mysql schema.prisma

