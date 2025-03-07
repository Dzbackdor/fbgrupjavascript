def saring_url(input_file, output_file):
    # Baca URL dari file
    try:
        with open(input_file, 'r') as file:
            urls = file.readlines()
        
        # Bersihkan dan saring URL
        url_tersaring = []
        for url in urls:
            # Hapus spasi dan garis miring di akhir
            url_bersih = url.strip().rstrip('/')
            # Hanya simpan URL grup facebook
            if 'facebook.com/groups/' in url_bersih:
                url_tersaring.append(url_bersih)
        
        # Tulis kembali URL yang sudah disaring ke file
        with open(output_file, 'w') as file:
            for url in url_tersaring:
                file.write(url + '\n')
        
        print(f"Total URL tersaring: {len(url_tersaring)}")
        print(f"Hasil tersimpan di: {output_file}")
        
    except FileNotFoundError:
        print(f"File {input_file} tidak ditemukan!")
    except Exception as e:
        print(f"Terjadi kesalahan: {str(e)}")

if __name__ == "__main__":
    base_path = input("Masukkan lokasi folder (contoh: C:\\Users\\LILAI PC\\Desktop\\grup): ")
    input_file = base_path + "\\grup_aktif.txt"
    output_file = base_path + "\\hasil_filter.txt"
    print(f"Membaca file dari: {input_file}")
    print(f"Hasil akan disimpan di: {output_file}")
    saring_url(input_file, output_file)
