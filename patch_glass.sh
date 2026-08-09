for file in src/components/*.tsx; do
  if [ "$file" = "src/components/PoloEgyptLogo.tsx" ]; then continue; fi
  
  sed -i 's/bg-white p-/bg-white\/10 backdrop-blur-xl p-/g' "$file"
  sed -i 's/bg-white rounded-/bg-white\/10 backdrop-blur-xl rounded-/g' "$file"
  sed -i 's/bg-slate-50/bg-white\/5/g' "$file"
  sed -i 's/bg-slate-100/bg-white\/10/g' "$file"
  sed -i 's/hover:bg-slate-50/hover:bg-white\/10/g' "$file"
  sed -i 's/hover:bg-slate-100/hover:bg-white\/10/g' "$file"
  sed -i 's/hover:bg-slate-200/hover:bg-white\/20/g' "$file"
  sed -i 's/border-slate-100/border-white\/10/g' "$file"
  sed -i 's/border-slate-200/border-white\/10/g' "$file"
  sed -i 's/border-slate-300/border-white\/20/g' "$file"
  sed -i 's/text-slate-900/text-white/g' "$file"
  sed -i 's/text-slate-800/text-white/g' "$file"
  sed -i 's/text-slate-700/text-slate-200/g' "$file"
  sed -i 's/text-slate-600/text-slate-300/g' "$file"
  sed -i 's/text-slate-500/text-slate-400/g' "$file"
done
