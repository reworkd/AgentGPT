#!/bin/bash
cd "$(dirname "$0")"

sed -ie 's/postgresql/sqlite/g' schema.prisma
sed -ie 's/@db.Text//' schema.prisma
