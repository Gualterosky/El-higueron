"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

const galleryImages = [
  // Escalada - Muro Bendito Sea
  { src: "/media/Muro bendito sea/Img01.jpg", alt: "Escaladores en el muro Bendito Sea", category: "escalada" },
  { src: "/media/Muro bendito sea/Img02.jpg", alt: "Escalador en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/Img03.jpg", alt: "Escalador en ruta vertical", category: "escalada" },
  { src: "/media/Muro bendito sea/Img04.jpg", alt: "Ruta de escalada", category: "escalada" },
  { src: "/media/Muro bendito sea/Img05.jpg", alt: "Escalador en ruta Bendito Sea 5.13a", category: "escalada" },
  { src: "/media/Muro bendito sea/Img06.jpg", alt: "Escaladores en competencia", category: "escalada" },
  { src: "/media/Muro bendito sea/Img11.jpg", alt: "Vista del muro principal", category: "escalada" },
  { src: "/media/Muro bendito sea/Img12.jpg", alt: "Escalador en ruta técnica", category: "escalada" },
  { src: "/media/Muro bendito sea/Img13.jpg", alt: "Vista panorámica del muro", category: "escalada" },
  { src: "/media/Muro bendito sea/Img14.jpg", alt: "Escalador en desplome", category: "escalada" },
  { src: "/media/Muro bendito sea/Img15.jpg", alt: "Sector de escalada", category: "escalada" },
  { src: "/media/Muro bendito sea/Img32.jpg", alt: "Ruta en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/Img33.jpg", alt: "Escalador en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_102757.jpg", alt: "Escalada en roca natural", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_102802.jpg", alt: "Escalador en muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_103619.jpg", alt: "Escalador asegurando", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_104104.jpg", alt: "Vista del muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_104247.jpg", alt: "Escalador en ruta", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_110130.jpg", alt: "Sector de escalada", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_110253.jpg", alt: "Escaladores en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_110432.jpg", alt: "Ruta de escalada", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_110438.jpg", alt: "Escalador en la pared", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20240914_113614.jpg", alt: "Vista general del muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250111_111515008_SR.jpg", alt: "Escalada en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250111_112116166_SR.jpg", alt: "Vista del muro al amanecer", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250111_112117391_HDR.jpg", alt: "Muro al amanecer", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250111_141453567_SR.jpg", alt: "Vista del muro desde el bosque", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250111_142426775_SR.jpg", alt: "Sector de escalada", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250111_163429153_SR.jpg", alt: "Escalador en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250119_162649072_SR.jpg", alt: "Ruta en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250127_143630903_SR.jpg", alt: "Escaladores practicando", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250127_144308745_SR.jpg", alt: "Escalada en roca", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250127_174825642_HDR.jpg", alt: "Atardecer en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250127_174829989_HDR.jpg", alt: "Colores del atardecer", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250212_082236976_MFNR.jpg", alt: "Escalada al amanecer", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250310_121017089.jpg", alt: "Sector del muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250310_121044592.jpg", alt: "Ruta de escalada", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250322_174755948_HDR.jpg", alt: "Atardecer en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250324_162809277_MFNR.jpg", alt: "Escalador en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20250628_160240571_SR.jpg", alt: "Escalada en roca", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20251004_151608316_SR.jpg", alt: "Escalador en plomo", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20251007_173031315_HDR.jpg", alt: "Vista del muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20251015_062609145_HDR.jpg", alt: "Amanecer en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20251025_171122595_MFNR.jpg", alt: "Escalada en la pared", category: "escalada" },
  { src: "/media/Muro bendito sea/IMG_20260422_090207600_HDR.jpg", alt: "Muro al amanecer", category: "escalada" },
  { src: "/media/Muro bendito sea/SaveClip.App_459245077_1229941394852830_7847908089500195245_n.jpg", alt: "Escalada en roca", category: "escalada" },
  { src: "/media/Muro bendito sea/SaveClip.App_459266872_1224793985193278_3489202943496719380_n.jpg", alt: "Escaladores en acción", category: "escalada" },
  { src: "/media/Muro bendito sea/SaveClip.App_459318099_2193454314358444_594684555200210283_n.jpg", alt: "Escalada deportiva", category: "escalada" },
  { src: "/media/Muro bendito sea/SaveClip.App_459643646_846084477629187_6533135530802500052_n.jpg", alt: "Escalador en el muro", category: "escalada" },
  { src: "/media/Muro bendito sea/SaveClip.App_459896839_545244217932500_3501026737579878985_n.jpg", alt: "Ruta de escalada", category: "escalada" },
  { src: "/media/Muro bendito sea/SaveClip.App_460024763_413125481412364_3326065898280239906_n.jpg", alt: "Escalada en roca natural", category: "escalada" },
  { src: "/media/Muro bendito sea/SaveClip.App_460142904_500926632642863_7737954932428144686_n.jpg", alt: "Escaladores en competencia", category: "escalada" },
  { src: "/media/Muro bendito sea/SaveClip.app.jpg", alt: "Escalada", category: "escalada" },
  
  // Boulder
  { src: "/media/Boulders/Img17.jpg", alt: "Escalador en boulder", category: "boulder" },
  { src: "/media/Boulders/Img18.jpg", alt: "Boulder panorámica", category: "boulder" },
  { src: "/media/Boulders/Img20.jpg", alt: "Problema de boulder", category: "boulder" },
  { src: "/media/Boulders/Img21.jpg", alt: "Escalador en boulder", category: "boulder" },
  { src: "/media/Boulders/Img22.jpg", alt: "Movimiento de boulder", category: "boulder" },
  { src: "/media/Boulders/Img23.jpg", alt: "Boulder en la naturaleza", category: "boulder" },
  { src: "/media/Boulders/Img24.jpg", alt: "Sesión de boulder", category: "boulder" },
  { src: "/media/Boulders/Img25.jpg", alt: "Escalador en bloque", category: "boulder" },
  { src: "/media/Boulders/Img26.jpg", alt: "Problema técnico de boulder", category: "boulder" },
  { src: "/media/Boulders/Img27.jpg", alt: "Boulder al aire libre", category: "boulder" },
  { src: "/media/Boulders/Img31.jpg", alt: "Vista zona de boulders", category: "boulder" },
  { src: "/media/Boulders/IMG_20250225_134033932_HDR.jpg", alt: "Formaciones de boulder", category: "boulder" },
  { src: "/media/Boulders/IMG_20250225_134043618_HDR.jpg", alt: "Zona de boulder", category: "boulder" },
  { src: "/media/Boulders/IMG_20250225_134115738_MFNR.jpg", alt: "Boulder con escalador", category: "boulder" },
  { src: "/media/Boulders/IMG_20250225_135027511_HDR.jpg", alt: "Bloque natural", category: "boulder" },
  { src: "/media/Boulders/IMG_20250225_135631657_HDR.jpg", alt: "Escalada en bloque", category: "boulder" },
  { src: "/media/Boulders/IMG_20250225_135647680_HDR.jpg", alt: "Zona de boulder", category: "boulder" },
  { src: "/media/Boulders/IMG_20250914_143103460_MFNR.jpg", alt: "Boulder al atardecer", category: "boulder" },
  { src: "/media/Boulders/IMG_20250920_092321682_HDR.jpg", alt: "Zona de boulders", category: "boulder" },
  { src: "/media/Boulders/IMG_20250920_100731134_MFNR.jpg", alt: "Boulder con escalador", category: "boulder" },
  { src: "/media/Boulders/IMG_20250920_100954059_HDR.jpg", alt: "Boulder con crashpad", category: "boulder" },
  { src: "/media/Boulders/IMG_20250920_162115607_MFNR.jpg", alt: "Atardecer en zona boulder", category: "boulder" },
  { src: "/media/Boulders/IMG_20251004_151602442_HDR.jpg", alt: "Escalador en bloque", category: "boulder" },
  { src: "/media/Boulders/IMG_20260430_120707095_HDR.jpg", alt: "Boulder natural", category: "boulder" },
  { src: "/media/Boulders/IMG_20260430_120731304_HDR.jpg", alt: "Crashpads para boulder", category: "boulder" },
  { src: "/media/Boulders/IMG_20260430_120745606_HDR.jpg", alt: "Escalador en boulder", category: "boulder" },
  { src: "/media/Boulders/IMG_20260430_120806490_HDR.jpg", alt: "Boulder al aire libre", category: "boulder" },
  { src: "/media/Boulders/IMG_20260430_120814612_HDR.jpg", alt: "Zona de boulders", category: "boulder" },
  
  // Camping
  { src: "/media/Camping/IMG_20240914_110259.jpg", alt: "Zona de camping", category: "camping" },
  { src: "/media/Camping/IMG_20250129_074449185_HDR.jpg", alt: "Amanecer en el camping", category: "camping" },
  { src: "/media/Camping/IMG_20250225_134602260_HDR.jpg", alt: "Carpas en el bosque", category: "camping" },
  { src: "/media/Camping/IMG_20250225_134710067_HDR.jpg", alt: "Carpas en el camping", category: "camping" },
  { src: "/media/Camping/IMG_20250225_134723182_MFNR.jpg", alt: "Área de camping", category: "camping" },
  { src: "/media/Camping/IMG_20250225_134741147_HDR.jpg", alt: "Camping entre árboles", category: "camping" },
  { src: "/media/Camping/IMG_20250225_134830298_MFNR.jpg", alt: "Equipo de camping", category: "camping" },
  { src: "/media/Camping/IMG_20250225_134909280_HDR.jpg", alt: "Vista del camping", category: "camping" },
  { src: "/media/Camping/IMG_20250225_135524468_HDR.jpg", alt: "Zona de descanso", category: "camping" },
  { src: "/media/Camping/IMG_20250225_135542144_HDR.jpg", alt: "Campamento entre naturaleza", category: "camping" },
  { src: "/media/Camping/IMG_20250914_155323584_MFNR.jpg", alt: "Tarde en el camping", category: "camping" },
  { src: "/media/Camping/IMG_20250920_125059918_HDR.jpg", alt: "Acampada al aire libre", category: "camping" },
  { src: "/media/Camping/IMG_20260116_132733975_MFNR.jpg", alt: "Paisaje desde el camping", category: "camping" },
  { src: "/media/Camping/IMG_20260116_132807499_MFNR.jpg", alt: "Vista de la montaña", category: "camping" },
  { src: "/media/Camping/IMG_20260116_175442021_MFNR.jpg", alt: "Camping con vista", category: "camping" },
  { src: "/media/Camping/IMG_20260116_175452246_MFNR.jpg", alt: "Atardecer en el camping", category: "camping" },
  { src: "/media/Camping/IMG_20260116_175500969_MFNR.jpg", alt: "Camping al atardecer", category: "camping" },
  { src: "/media/Camping/IMG_20260117_080602542_HDR.jpg", alt: "Fogata en el camping", category: "camping" },
  { src: "/media/Camping/Img19.jpg", alt: "Camping con vista a la montaña", category: "camping" },
  
  // Naturaleza
  { src: "/media/Naturaleza-paisajes/1742735046369.jpg", alt: "Paisaje de montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20240804_160128.jpg", alt: "Vista natural", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20240804_180618.jpg", alt: "Bosque al atardecer", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20240908_083909.jpg", alt: "Amanecer en la montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20240908_083913.jpg", alt: "Mañana en la naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20240918_150524.jpg", alt: "Paisaje de bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250116_124928256_MFNR.jpg", alt: "Flora nativa", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250116_124933263_MFNR.jpg", alt: "Vegetación andina", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250116_124942649_MFNR.jpg", alt: "Bosque alto andino", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250116_124955046_MFNR.jpg", alt: "Paisaje verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250121_174825464_HDR.jpg", alt: "Cielo al atardecer", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250121_174826715_HDR.jpg", alt: "Colores del atardecer", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250121_174829604_HDR.jpg", alt: "Puesta de sol", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250121_174834480_MFNR.jpg", alt: "Atardecer en la montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250121_174841943_MFNR.jpg", alt: "Atardecer en la naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162640140_HDR.jpg", alt: "Paisaje del bosque andino", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162645017_MFNR.jpg", alt: "Vegetación del páramo", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162756601_HDR.jpg", alt: "Bosque alto andino", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162909418_HDR.jpg", alt: "Montañas de Choachí", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162931388_MFNR.jpg", alt: "Vista panorámica", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162948502_MFNR.jpg", alt: "Montañas", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_162950272_MFNR.jpg", alt: "Paisaje de montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_163002929_MFNR.jpg", alt: "Bosque de niebla", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_163432836_HDR.jpg", alt: "Sendero en el bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_163435784_HDR.jpg", alt: "Camino en la montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_165114112_HDR.jpg", alt: "Vista de la montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_165116004_HDR.jpg", alt: "Panorámica", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250126_165116990_HDR.jpg", alt: "Paisaje desde El Higuerón", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250127_121755579_MFNR.jpg", alt: "Vista del valle", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250127_121757618_MFNR.jpg", alt: "Valle de montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_134919014_MFNR.jpg", alt: "Flora nativa", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_134946534_MFNR.jpg", alt: "Vegetación andina", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_135610722_HDR.jpg", alt: "Paisaje de montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_135937239_HDR.jpg", alt: "Bosque verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_140002347_MFNR.jpg", alt: "Bosque alto andino", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_140005398_MFNR.jpg", alt: "Vista del bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_140042979_HDR.jpg", alt: "Rocas y vegetación", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_140049571_HDR.jpg", alt: "Formaciones rocosas", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_140255317_HDR.jpg", alt: "Sendero natural", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250225_140311826_HDR.jpg", alt: "Paisaje en montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250302_143711574_MFNR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250302_143712819_MFNR.jpg", alt: "Paisaje natural", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250303_113928718_MFNR.jpg", alt: "Bosque verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250309_144746548_MFNR.jpg", alt: "Paisaje montañoso", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250309_145647464_MFNR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250309_145651402_MFNR.jpg", alt: "Vista panorámica", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250309_145705832_MFNR.jpg", alt: "Naturaleza verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250309_145708611_MFNR.jpg", alt: "Bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250309_145715241_MFNR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_112834414_MFNR.jpg", alt: "Paisaje montañoso", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_112841347_MFNR.jpg", alt: "Montaña verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_112850212_MFNR.jpg", alt: "Naturaleza hermosa", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_113159015_MFNR.jpg", alt: "Bosque andino", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_113220545_MFNR.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_113244903_HDR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_113321504_MFNR.jpg", alt: "Naturaleza verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_113341290_MFNR.jpg", alt: "Bosque frondoso", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_113513634_HDR.jpg", alt: "Paisaje montañoso", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_113843434_HDR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_114425352_MFNR.jpg", alt: "Bosque verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_114435064_MFNR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_114445363_MFNR.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_115627899_MFNR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_115646400_MFNR.jpg", alt: "Bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_120052171_HDR.jpg", alt: "Paisaje natural", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_121124162_MFNR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_122147305_HDR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_122419952_MFNR.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_122535522_MFNR.jpg", alt: "Naturaleza verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_122544851.jpg", alt: "Bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_122555293.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_122648620_HDR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_122702792_HDR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_123238806_HDR.jpg", alt: "Paisaje natural", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_123253944_HDR.jpg", alt: "Montaña hermosa", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_123315576.jpg", alt: "Bosque verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_123732098_MFNR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_125957684_HDR.jpg", alt: "Paisaje montañoso", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_130014152.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250310_130022702_HDR.jpg", alt: "Bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250311_174040945_MFNR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250311_174110908_HDR.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250314_090826101_MFNR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250323_080324933_HDR.jpg", alt: "Naturaleza verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250323_080333902_HDR.jpg", alt: "Bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250323_154256642_HDR.jpg", alt: "Paisaje natural", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250323_154311917.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250514_152641630.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250515_161147084.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250515_161422183.jpg", alt: "Bosque verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250515_162041892.jpg", alt: "Montaña hermosa", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250515_162225833.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250515_162520679.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250529_095844754_MFNR.jpg", alt: "Bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250529_095910744_HDR.jpg", alt: "Paisaje montañoso", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250529_095931965_MFNR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250630_082403416_HDR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250630_154759748_MFNR.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250630_154800755_MFNR.jpg", alt: "Bosque verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250702_082733515_MFNR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250702_082737297_MFNR.jpg", alt: "Naturaleza verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250702_082757178_MFNR.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250705_085013022_MFNR.jpg", alt: "Bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250710_152822224_MFNR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250710_152834397_MFNR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_090229628_HDR.jpg", alt: "Paisaje natural", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_090440432_HDR.jpg", alt: "Montaña hermosa", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_090452046_HDR.jpg", alt: "Bosque verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_091535507_HDR.jpg", alt: "Paisaje montañoso", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_091744994_HDR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_091833016_HDR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_161127448_HDR.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_161201965_MFNR.jpg", alt: "Bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_163920916_HDR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250712_164306003_HDR.jpg", alt: "Naturaleza verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250816_072053834_HDR.jpg", alt: "Paisaje natural", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250824_084010826_HDR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250913_124139867_HDR.jpg", alt: "Bosque hermoso", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20250928_155311746_HDR.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251007_174454446_MFNR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251018_112648768_MFNR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251021_052858449_MFNR.jpg", alt: "Paisaje montañoso", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251025_171141413_MFNR.jpg", alt: "Bosque verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251121_073859116_MFNR.jpg", alt: "Naturaleza", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251130_160815255_HDR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251219_114612789_MFNR.jpg", alt: "Paisaje natural", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251219_114720876_MFNR.jpg", alt: "Bosque", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251219_114724094_MFNR.jpg", alt: "Montaña hermosa", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251219_114728795_MFNR.jpg", alt: "Paisaje", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251224_104522407_MFNR.jpg", alt: "Naturaleza verde", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251224_104524384_HDR.jpg", alt: "Montaña", category: "naturaleza" },
  { src: "/media/Naturaleza-paisajes/IMG_20251227_174155207_HDR.jpg", alt: "Paisaje natural", category: "naturaleza" },
]

const categoryKeys = ["all", "escalada", "boulder", "camping", "naturaleza"] as const

export default function GaleriaPage() {
  const t = useTranslations("Galeria")
  const [selectedCategory, setSelectedCategory] = useState<(typeof categoryKeys)[number]>("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  
  const goToPrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1)
    }
  }
  
  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-forest">
        <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="animate-fade-in-up animation-delay-100 mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="border-b border-border bg-background py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoryKeys.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category 
                    ? "bg-forest text-white hover:bg-forest-light" 
                    : "border-forest text-forest hover:bg-forest hover:text-white"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {t(`filters.${category}`)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredImages.map((image, index) => (
              <div 
                key={index}
                className="group relative cursor-pointer overflow-hidden rounded-xl"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-[4/3]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-forest/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="p-4">
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {t(`filters.${image.category}`)}
                    </span>
                    <p className="mt-2 text-sm text-white">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={closeLightbox}
            aria-label={t("lightbox.close")}
          >
            <X className="h-6 w-6" />
          </button>
          
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            aria-label={t("lightbox.prev")}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            aria-label={t("lightbox.next")}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div 
            className="relative max-h-[80vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            <div className="mt-4 text-center">
              <p className="text-white">{filteredImages[lightboxIndex].alt}</p>
              <span className="mt-1 inline-block text-sm text-white/70">
                {lightboxIndex + 1} / {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
