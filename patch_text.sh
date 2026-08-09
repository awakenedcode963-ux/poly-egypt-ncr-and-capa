for file in src/components/*.tsx; do
  if [ "$file" = "src/components/PoloEgyptLogo.tsx" ]; then continue; fi
  
  sed -i 's/text-\\[#0B3A60\\]/text-\\[#C1A67B\\]/g' "$file"
  sed -i 's/text-slate-950/text-white/g' "$file"
done
